const crypto = require('crypto');

function getWebhookSecret() {
  return process.env.PAYMENT_WEBHOOK_SECRET || '';
}

function signPayload(payload, secret) {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

function timingSafeEqual(a, b) {
  const left = Buffer.from(a, 'utf8');
  const right = Buffer.from(b, 'utf8');

  if (left.length !== right.length) {
    return false;
  }

  return crypto.timingSafeEqual(left, right);
}

function verifyWebhookSignature(req) {
  const secret = getWebhookSecret();
  if (!secret) {
    return false;
  }

  const signature = req.headers['x-voltex-signature'];
  if (!signature || !req.rawBody) {
    return false;
  }

  const expected = signPayload(req.rawBody.toString('utf8'), secret);
  return timingSafeEqual(signature, expected);
}

module.exports = {
  getWebhookSecret,
  signPayload,
  verifyWebhookSignature,
};
