function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function normalizePhone(phone) {
  return String(phone || '').replace(/[^\d+]/g, '').trim();
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));
}

function validatePassword(password) {
  return typeof password === 'string' && password.length >= 8;
}

function validatePhone(phone) {
  const normalized = normalizePhone(phone);
  return normalized.length >= 10 && normalized.length <= 16;
}

function validatePositiveAmount(amount, { min = 1, max = 100000 } = {}) {
  const parsed = Number(amount);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  if (parsed < min || parsed > max) {
    return null;
  }

  return parsed;
}

function validateWalletAddress(address) {
  return typeof address === 'string' && address.trim().length >= 10;
}

module.exports = {
  normalizeEmail,
  normalizePhone,
  validateEmail,
  validatePassword,
  validatePhone,
  validatePositiveAmount,
  validateWalletAddress,
};
