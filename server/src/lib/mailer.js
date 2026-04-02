const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const logger = require('./logger');

const MAIL_PROVIDER = process.env.MAIL_PROVIDER || (process.env.SENDGRID_API_KEY ? 'sendgrid' : 'smtp');
const MAIL_FROM = process.env.MAIL_FROM || 'VoltexBazar <noreply@voltexbazar.io>';

function canUseSendGrid() {
  return Boolean(process.env.SENDGRID_API_KEY);
}

function canUseSmtp() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function buildTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendEmail({ to, subject, text, html, category }) {
  if (!to) {
    return { delivered: false, reason: 'missing_recipient' };
  }

  if (MAIL_PROVIDER === 'sendgrid' && canUseSendGrid()) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    await sgMail.send({
      to,
      from: MAIL_FROM,
      subject,
      text,
      html,
    });

    logger.info('email_sent', { provider: 'sendgrid', to, category });
    return { delivered: true, provider: 'sendgrid' };
  }

  if (canUseSmtp()) {
    const transport = buildTransport();
    await transport.sendMail({
      from: MAIL_FROM,
      to,
      subject,
      text,
      html,
    });

    logger.info('email_sent', { provider: 'smtp', to, category });
    return { delivered: true, provider: 'smtp' };
  }

  logger.warn('email_skipped', {
    to,
    category,
    reason: 'mail_provider_not_configured',
  });
  return { delivered: false, reason: 'mail_provider_not_configured' };
}

async function sendWelcomeEmail(user) {
  return sendEmail({
    to: user.email,
    category: 'welcome',
    subject: 'Welcome to VoltexBazar',
    text: `Hi ${user.name}, your VoltexBazar account is active. You can now browse agents, create payment intents, and launch your first AI operator.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#111827">
        <h1 style="margin-bottom:16px;">Welcome to VoltexBazar</h1>
        <p>Hi ${user.name},</p>
        <p>Your account is active. You can now browse agents, create payment intents, and launch your first AI operator.</p>
        <p>VoltexBazar is being built for teams and individuals who want AI systems that can be deployed with clear ownership and predictable operations.</p>
      </div>
    `,
  });
}

async function sendPaymentInstructionsEmail(user, payment) {
  return sendEmail({
    to: user.email,
    category: 'payment_instructions',
    subject: `Complete your ${payment.currency} payment`,
    text: `Hi ${user.name}, send exactly ${payment.amount} ${payment.currency} on ${payment.network} to ${payment.address}. This payment window expires at ${payment.expiresAt}.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#111827">
        <h1 style="margin-bottom:16px;">Payment Instructions</h1>
        <p>Hi ${user.name},</p>
        <p>Send exactly <strong>${payment.amount} ${payment.currency}</strong> on <strong>${payment.network}</strong>.</p>
        <p><strong>Deposit reference:</strong><br />${payment.address}</p>
        <p><strong>Treasury address:</strong><br />${payment.treasuryAddress}</p>
        <p>This payment window expires at ${payment.expiresAt}.</p>
      </div>
    `,
  });
}

async function sendPaymentConfirmedEmail(user, payment) {
  return sendEmail({
    to: user.email,
    category: 'payment_confirmed',
    subject: 'Your VoltexBazar payment is confirmed',
    text: `Hi ${user.name}, your ${payment.currency} payment for ${payment.plan} has been confirmed. Transaction hash: ${payment.txHash || 'pending'}.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#111827">
        <h1 style="margin-bottom:16px;">Payment Confirmed</h1>
        <p>Hi ${user.name},</p>
        <p>Your payment for <strong>${payment.plan}</strong> has been confirmed.</p>
        <p><strong>Amount:</strong> ${payment.amount} ${payment.currency}</p>
        <p><strong>Transaction:</strong> ${payment.txHash || 'pending'}</p>
      </div>
    `,
  });
}

async function sendWithdrawalQueuedEmail(user, withdrawal) {
  return sendEmail({
    to: user.email,
    category: 'withdrawal_queued',
    subject: 'Your withdrawal request has been queued',
    text: `Hi ${user.name}, your withdrawal request for ${withdrawal.amount} ${withdrawal.currency} is queued for review.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#111827">
        <h1 style="margin-bottom:16px;">Withdrawal Request Received</h1>
        <p>Hi ${user.name},</p>
        <p>Your withdrawal request for <strong>${withdrawal.amount} ${withdrawal.currency}</strong> is queued for review.</p>
        <p><strong>Destination:</strong><br />${withdrawal.address}</p>
      </div>
    `,
  });
}

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPaymentInstructionsEmail,
  sendPaymentConfirmedEmail,
  sendWithdrawalQueuedEmail,
};
