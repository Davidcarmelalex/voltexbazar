const crypto = require('crypto');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { requireAuth } = require('../lib/auth');
const {
  findWalletByUserId,
  findPaymentById,
  findPaymentByAddress,
  findPaymentsByUserId,
  getOrCreateWallet,
  reservePaymentCredit,
  settlePayment,
  expirePayment,
  createWithdrawal,
} = require('../lib/paymentStore');
const logger = require('../lib/logger');
const { verifyWebhookSignature, getWebhookSecret } = require('../lib/webhookSecurity');
const { findUserById } = require('../lib/store');
const {
  sendPaymentInstructionsEmail,
  sendPaymentConfirmedEmail,
  sendWithdrawalQueuedEmail,
} = require('../lib/mailer');
const {
  validatePositiveAmount,
  validateWalletAddress,
} = require('../lib/validators');

const router = express.Router();

const PAYMENT_TOKEN = process.env.PAYMENT_TOKEN || 'USDT';
const PAYMENT_CHAIN = process.env.PAYMENT_CHAIN || 'Base';
const PAYMENT_SUPPORTED_TOKENS = (process.env.PAYMENT_SUPPORTED_TOKENS || `${PAYMENT_TOKEN},USDC`)
  .split(',')
  .map((item) => item.trim().toUpperCase())
  .filter(Boolean);
const PAYMENT_SUPPORTED_CHAINS = (process.env.PAYMENT_SUPPORTED_CHAINS || PAYMENT_CHAIN)
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);
const PAYMENT_WALLET_ADDRESS = process.env.PAYMENT_WALLET_ADDRESS || '';
const PAYMENT_TTL_MINUTES = Number(process.env.PAYMENT_TTL_MINUTES || 30);
const PAYMENT_CONFIRMATIONS_REQUIRED = Number(process.env.PAYMENT_CONFIRMATIONS_REQUIRED || 3);

function requireTreasuryAddress() {
  if (!PAYMENT_WALLET_ADDRESS) {
    throw new Error('PAYMENT_WALLET_ADDRESS must be configured for production deposits');
  }
}

function generateDepositAddress(userId, paymentId) {
  requireTreasuryAddress();
  const derivedSuffix = crypto
    .createHash('sha256')
    .update(`${userId}:${paymentId}:${PAYMENT_WALLET_ADDRESS}`)
    .digest('hex')
    .slice(0, 16);

  return `${PAYMENT_WALLET_ADDRESS}:${derivedSuffix}`;
}

async function ensureWallet(userId) {
  requireTreasuryAddress();
  return getOrCreateWallet(userId, PAYMENT_WALLET_ADDRESS);
}

function resolveRequestedCurrency(rawCurrency) {
  const requested = String(rawCurrency || PAYMENT_TOKEN).trim().toUpperCase();
  if (!PAYMENT_SUPPORTED_TOKENS.includes(requested)) {
    return null;
  }

  return requested;
}

router.post('/create', requireAuth, async (req, res) => {
  try {
    const { plan, amount, currency } = req.body;
    const userId = req.user.userId;
    const parsedAmount = validatePositiveAmount(amount, { min: 10, max: 250000 });

    if (parsedAmount === null) {
      return res.status(400).json({ success: false, message: 'A valid amount between 10 and 250000 is required' });
    }

    const resolvedCurrency = resolveRequestedCurrency(currency);
    if (!resolvedCurrency) {
      return res.status(400).json({
        success: false,
        message: `Only ${PAYMENT_SUPPORTED_TOKENS.join(', ')} are currently supported on EVM chains`,
      });
    }

    const wallet = await ensureWallet(userId);
    const paymentId = uuidv4();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + PAYMENT_TTL_MINUTES * 60 * 1000);
    const receiveAddress = generateDepositAddress(userId, paymentId);

    const { payment } = await reservePaymentCredit({
      id: paymentId,
      userId,
      plan: plan || 'custom',
      amount: parsedAmount,
      currency: resolvedCurrency,
      chain: PAYMENT_CHAIN,
      address: wallet.address,
      receiveAddress,
      status: 'pending',
      txHash: null,
      confirmations: 0,
      createdAt: now,
      expiresAt,
      instructions: `Send exactly ${parsedAmount} ${resolvedCurrency} on ${PAYMENT_CHAIN} to the unique deposit reference shown. Only EVM-compatible stablecoin transfers are accepted for now.`,
      metadata: {
        treasuryAddress: wallet.address,
        depositReference: receiveAddress,
      },
    });

    const user = await findUserById(userId);
    if (user?.email) {
      await sendPaymentInstructionsEmail(user, {
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        address: payment.receiveAddress,
        treasuryAddress: payment.address,
        network: payment.chain,
        expiresAt: payment.expiresAt,
      });
    }

    return res.status(201).json({
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        address: payment.receiveAddress,
        treasuryAddress: payment.address,
        network: payment.chain,
        expiresAt: payment.expiresAt,
        instructions: payment.instructions,
      },
    });
  } catch (error) {
    logger.error('create_payment_failed', { error: error.message, stack: error.stack });
    return res.status(500).json({ success: false, message: 'Failed to create payment' });
  }
});

router.get('/status/:id', requireAuth, async (req, res) => {
  try {
    const payment = await findPaymentById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    if (payment.userId !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    if (payment.expiresAt && new Date(payment.expiresAt).getTime() < Date.now() && payment.status === 'pending') {
      const expired = await expirePayment(payment.id);
      return res.json({ success: true, payment: expired });
    }

    return res.json({ success: true, payment });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to get payment status' });
  }
});

router.post('/webhook', async (req, res) => {
  try {
    if (!getWebhookSecret()) {
      return res.status(503).json({ success: false, message: 'Webhook secret is not configured' });
    }

    if (!verifyWebhookSignature(req)) {
      return res.status(401).json({ success: false, message: 'Invalid webhook signature' });
    }

    const { txHash, fromAddress, toAddress, amount, confirmations, paymentId, chain, currency } = req.body;
    const parsedAmount = Number(amount);
    const parsedConfirmations = Number(confirmations || 0);

    if (!toAddress) {
      return res.status(400).json({ success: false, message: 'Destination address required' });
    }

    if (!txHash) {
      return res.status(400).json({ success: false, message: 'Transaction hash required' });
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ success: false, message: 'A valid amount is required' });
    }

    const payment = (paymentId ? await findPaymentById(paymentId) : null) || (await findPaymentByAddress(toAddress));
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    if (payment.chain !== (chain || payment.chain) || payment.currency !== (currency || payment.currency)) {
      return res.status(400).json({ success: false, message: 'Payment asset mismatch' });
    }

    if (payment.expiresAt && new Date(payment.expiresAt).getTime() < Date.now()) {
      const expired = await expirePayment(payment.id);
      return res.status(409).json({ success: false, message: 'Payment has expired', payment: expired });
    }

    const result = await settlePayment({
      paymentId: payment.id,
      txHash,
      fromAddress,
      confirmations: parsedConfirmations,
      observedAmount: parsedAmount,
      metadata: {
        webhookReceivedAt: new Date().toISOString(),
        toAddress,
      },
    });

    logger.info('payment_webhook_processed', {
      paymentId: payment.id,
      txHash,
      toAddress,
      confirmations: parsedConfirmations,
      status: result.payment.status,
    });

    if (result.payment.status === 'completed') {
      const user = await findUserById(payment.userId);
      if (user?.email) {
        await sendPaymentConfirmedEmail(user, {
          plan: payment.plan,
          amount: result.payment.creditedAmount,
          currency: payment.currency,
          txHash,
        });
      }
    }

    return res.json({ success: true, payment: result.payment, wallet: result.wallet });
  } catch (error) {
    logger.error('payment_webhook_failed', { error: error.message, stack: error.stack });
    return res.status(500).json({ success: false, message: 'Webhook processing failed' });
  }
});

router.get('/config', (req, res) => {
  res.json({
    success: true,
    config: {
      token: PAYMENT_TOKEN,
      chain: PAYMENT_CHAIN,
      supportedTokens: PAYMENT_SUPPORTED_TOKENS,
      supportedChains: PAYMENT_SUPPORTED_CHAINS,
      paymentWindowMinutes: PAYMENT_TTL_MINUTES,
      confirmationsRequired: PAYMENT_CONFIRMATIONS_REQUIRED,
      walletAddress: PAYMENT_WALLET_ADDRESS,
    },
  });
});

router.get('/wallet/me', requireAuth, async (req, res) => {
  try {
    const wallet = await ensureWallet(req.user.userId);
    return res.json({ success: true, wallet });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to get wallet' });
  }
});

router.get('/wallet/:userId', requireAuth, async (req, res) => {
  try {
    if (req.user.userId !== req.params.userId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const wallet = await ensureWallet(req.params.userId);
    return res.json({ success: true, wallet });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to get wallet' });
  }
});

router.get('/transactions/me', requireAuth, async (req, res) => {
  try {
    const transactions = await findPaymentsByUserId(req.user.userId);
    return res.json({ success: true, transactions });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to get transactions' });
  }
});

router.get('/transactions/:userId', requireAuth, async (req, res) => {
  try {
    if (req.user.userId !== req.params.userId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const transactions = await findPaymentsByUserId(req.params.userId);
    return res.json({ success: true, transactions });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to get transactions' });
  }
});

router.post('/withdraw', requireAuth, async (req, res) => {
  try {
    const { amount, address } = req.body;
    const parsedAmount = validatePositiveAmount(amount, { min: 10, max: 250000 });

    if (parsedAmount === null || !validateWalletAddress(address)) {
      return res.status(400).json({ success: false, message: 'A valid amount and destination address are required' });
    }

    const wallet = await findWalletByUserId(req.user.userId);
    if (!wallet || wallet.balance < parsedAmount) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    const { withdrawal } = await createWithdrawal({
      id: uuidv4(),
      userId: req.user.userId,
      amount: parsedAmount,
      address,
      chain: PAYMENT_CHAIN,
      currency: PAYMENT_TOKEN,
      metadata: {
        requestedAt: new Date().toISOString(),
      },
    });

    const user = await findUserById(req.user.userId);
    if (user?.email) {
      await sendWithdrawalQueuedEmail(user, withdrawal);
    }

    return res.json({
      success: true,
      message: 'Withdrawal queued for review',
      withdrawal,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Withdrawal failed' });
  }
});

module.exports = router;
