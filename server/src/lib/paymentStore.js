const { Prisma } = require('@prisma/client');
const { prisma } = require('./store');

function decimal(value) {
  return new Prisma.Decimal(value || 0);
}

function toNumber(value) {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    return Number(value);
  }

  if (typeof value.toNumber === 'function') {
    return value.toNumber();
  }

  return Number(value);
}

function normalizeWallet(wallet) {
  if (!wallet) {
    return null;
  }

  return {
    ...wallet,
    balance: toNumber(wallet.balance),
    pendingBalance: toNumber(wallet.pendingBalance),
    lockedBalance: toNumber(wallet.lockedBalance),
  };
}

function normalizePayment(payment) {
  if (!payment) {
    return null;
  }

  return {
    ...payment,
    amount: toNumber(payment.amount),
    expectedAmount: toNumber(payment.expectedAmount),
    creditedAmount: toNumber(payment.creditedAmount),
  };
}

function normalizeWithdrawal(withdrawal) {
  if (!withdrawal) {
    return null;
  }

  return {
    ...withdrawal,
    amount: toNumber(withdrawal.amount),
  };
}

async function saveWallet(walletData, tx = prisma) {
  const wallet = await tx.wallet.upsert({
    where: { userId: walletData.userId },
    update: {
      address: walletData.address,
      balance: decimal(walletData.balance),
      pendingBalance: decimal(walletData.pendingBalance),
      lockedBalance: decimal(walletData.lockedBalance),
      lastSettledAt: walletData.lastSettledAt || undefined,
    },
    create: {
      userId: walletData.userId,
      address: walletData.address,
      balance: decimal(walletData.balance),
      pendingBalance: decimal(walletData.pendingBalance),
      lockedBalance: decimal(walletData.lockedBalance),
      lastSettledAt: walletData.lastSettledAt || undefined,
    },
  });

  return normalizeWallet(wallet);
}

async function savePayment(paymentData, tx = prisma) {
  const payment = await tx.payment.upsert({
    where: { id: paymentData.id },
    update: {
      plan: paymentData.plan,
      amount: decimal(paymentData.amount),
      currency: paymentData.currency,
      chain: paymentData.chain,
      address: paymentData.address,
      receiveAddress: paymentData.receiveAddress,
      status: paymentData.status,
      txHash: paymentData.txHash || undefined,
      fromAddress: paymentData.fromAddress || undefined,
      confirmations: paymentData.confirmations || 0,
      expectedAmount: decimal(paymentData.expectedAmount ?? paymentData.amount),
      creditedAmount: decimal(paymentData.creditedAmount || 0),
      ledgerApplied: Boolean(paymentData.ledgerApplied),
      metadata: paymentData.metadata || undefined,
      expiresAt: new Date(paymentData.expiresAt),
      instructions: paymentData.instructions,
    },
    create: {
      id: paymentData.id,
      userId: paymentData.userId,
      plan: paymentData.plan,
      amount: decimal(paymentData.amount),
      currency: paymentData.currency,
      chain: paymentData.chain,
      address: paymentData.address,
      receiveAddress: paymentData.receiveAddress,
      status: paymentData.status,
      txHash: paymentData.txHash || undefined,
      fromAddress: paymentData.fromAddress || undefined,
      confirmations: paymentData.confirmations || 0,
      expectedAmount: decimal(paymentData.expectedAmount ?? paymentData.amount),
      creditedAmount: decimal(paymentData.creditedAmount || 0),
      ledgerApplied: Boolean(paymentData.ledgerApplied),
      metadata: paymentData.metadata || undefined,
      createdAt: paymentData.createdAt ? new Date(paymentData.createdAt) : undefined,
      expiresAt: new Date(paymentData.expiresAt),
      instructions: paymentData.instructions,
    },
  });

  return normalizePayment(payment);
}

async function findWalletByUserId(userId) {
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  return normalizeWallet(wallet);
}

async function findPaymentById(id) {
  const payment = await prisma.payment.findUnique({ where: { id } });
  return normalizePayment(payment);
}

async function findPaymentByAddress(address) {
  const payment = await prisma.payment.findFirst({
    where: {
      OR: [{ address }, { receiveAddress: address }],
      status: { in: ['pending', 'processing'] },
    },
    orderBy: { createdAt: 'desc' },
  });

  return normalizePayment(payment);
}

async function findPaymentsByUserId(userId) {
  const payments = await prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  const withdrawals = await prisma.withdrawal.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return [
    ...payments.map((payment) => ({
      ...normalizePayment(payment),
      type: 'deposit',
      date: payment.createdAt,
    })),
    ...withdrawals.map((withdrawal) => ({
      ...normalizeWithdrawal(withdrawal),
      type: 'withdrawal',
      date: withdrawal.createdAt,
    })),
  ].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
}

async function getOrCreateWallet(userId, walletAddress, tx = prisma) {
  const existing = await tx.wallet.findUnique({ where: { userId } });
  if (existing) {
    return normalizeWallet(existing);
  }

  return saveWallet({
    userId,
    address: walletAddress,
    balance: 0,
    pendingBalance: 0,
    lockedBalance: 0,
  }, tx);
}

async function reservePaymentCredit(paymentData) {
  return prisma.$transaction(async (tx) => {
    const wallet = await getOrCreateWallet(paymentData.userId, paymentData.address, tx);
    const nextPending = decimal(wallet.pendingBalance).plus(decimal(paymentData.amount));

    const updatedWallet = await saveWallet({
      userId: paymentData.userId,
      address: wallet.address,
      balance: wallet.balance,
      pendingBalance: nextPending,
      lockedBalance: wallet.lockedBalance,
    }, tx);

    const payment = await savePayment({
      ...paymentData,
      expectedAmount: paymentData.amount,
      creditedAmount: 0,
      ledgerApplied: false,
    }, tx);

    return { wallet: updatedWallet, payment };
  });
}

async function settlePayment({ paymentId, txHash, fromAddress, confirmations, observedAmount, metadata }) {
  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: { id: paymentId },
      include: { user: true },
    });

    if (!payment) {
      return null;
    }

    if (payment.ledgerApplied) {
      return {
        payment: normalizePayment(payment),
        wallet: normalizeWallet(await tx.wallet.findUnique({ where: { userId: payment.userId } })),
      };
    }

    const wallet = await tx.wallet.findUnique({ where: { userId: payment.userId } });
    if (!wallet) {
      throw new Error('Wallet not found for payment settlement');
    }

    const creditedAmount = decimal(observedAmount ?? payment.amount);
    const balanceAfter = decimal(wallet.balance).plus(creditedAmount);
    const pendingAfter = Prisma.Decimal.max(decimal(wallet.pendingBalance).minus(decimal(payment.amount)), new Prisma.Decimal(0));

    const updatedPayment = await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: confirmations >= 3 ? 'completed' : 'processing',
        txHash,
        fromAddress: fromAddress || undefined,
        confirmations,
        creditedAmount,
        ledgerApplied: confirmations >= 3,
        metadata: metadata || undefined,
      },
    });

    let updatedWallet = wallet;

    if (confirmations >= 3) {
      updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: balanceAfter,
          pendingBalance: pendingAfter,
          lastSettledAt: new Date(),
        },
      });

      await tx.walletLedgerEntry.create({
        data: {
          walletId: wallet.id,
          paymentId: payment.id,
          type: 'deposit_settlement',
          amount: creditedAmount,
          balanceAfter,
          description: `Settled ${payment.currency} payment for ${payment.plan}`,
          metadata: metadata || undefined,
        },
      });
    }

    return {
      payment: normalizePayment(updatedPayment),
      wallet: normalizeWallet(updatedWallet),
    };
  });
}

async function expirePayment(paymentId) {
  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({ where: { id: paymentId } });
    if (!payment || payment.status === 'completed' || payment.status === 'expired') {
      return normalizePayment(payment);
    }

    const wallet = await tx.wallet.findUnique({ where: { userId: payment.userId } });
    if (wallet) {
      const pendingAfter = Prisma.Decimal.max(decimal(wallet.pendingBalance).minus(decimal(payment.amount)), new Prisma.Decimal(0));
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { pendingBalance: pendingAfter },
      });
    }

    const updatedPayment = await tx.payment.update({
      where: { id: paymentId },
      data: { status: 'expired' },
    });

    return normalizePayment(updatedPayment);
  });
}

async function createWithdrawal(withdrawalData) {
  return prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.findUnique({ where: { userId: withdrawalData.userId } });
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    const amount = decimal(withdrawalData.amount);
    if (decimal(wallet.balance).lessThan(amount)) {
      throw new Error('Insufficient balance');
    }

    const balanceAfter = decimal(wallet.balance).minus(amount);
    const lockedAfter = decimal(wallet.lockedBalance).plus(amount);

    const updatedWallet = await tx.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: balanceAfter,
        lockedBalance: lockedAfter,
      },
    });

    const withdrawal = await tx.withdrawal.create({
      data: {
        userId: withdrawalData.userId,
        walletId: wallet.id,
        amount,
        address: withdrawalData.address,
        chain: withdrawalData.chain,
        currency: withdrawalData.currency,
        status: 'pending_review',
        metadata: withdrawalData.metadata || undefined,
      },
    });

    await tx.walletLedgerEntry.create({
      data: {
        walletId: wallet.id,
        withdrawalId: withdrawal.id,
        type: 'withdrawal_hold',
        amount: amount.negated(),
        balanceAfter,
        description: `Withdrawal request created for ${withdrawalData.currency}`,
        metadata: withdrawalData.metadata || undefined,
      },
    });

    return {
      wallet: normalizeWallet(updatedWallet),
      withdrawal: normalizeWithdrawal(withdrawal),
    };
  });
}

module.exports = {
  saveWallet,
  savePayment,
  findWalletByUserId,
  findPaymentById,
  findPaymentByAddress,
  findPaymentsByUserId,
  getOrCreateWallet,
  reservePaymentCredit,
  settlePayment,
  expirePayment,
  createWithdrawal,
  normalizeWallet,
  normalizePayment,
};
