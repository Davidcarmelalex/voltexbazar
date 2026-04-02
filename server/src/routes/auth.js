const crypto = require('crypto');
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const {
  sanitizeUser,
  findUserById,
  findUserByEmail,
  findUserByPhone,
  createUser,
  findOrCreatePhoneUser,
  saveOtp,
  findOtpByPhone,
  deleteOtpByPhone,
} = require('../lib/store');
const { signUserToken, setAuthCookie, clearAuthCookie, requireAuth } = require('../lib/auth');
const { sendWelcomeEmail } = require('../lib/mailer');
const {
  normalizeEmail,
  normalizePhone,
  validateEmail,
  validatePassword,
  validatePhone,
} = require('../lib/validators');

const router = express.Router();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function hashOtp(phone, otp) {
  return crypto
    .createHash('sha256')
    .update(`${phone}:${otp}:${process.env.JWT_SECRET || 'otp-fallback-secret'}`)
    .digest('hex');
}

function sendOTP(phone, otp) {
  console.log(`Sending OTP ${otp} to ${phone}`);
  return true;
}

router.post('/register', async (req, res) => {
  try {
    const { name, password } = req.body;
    const email = normalizeEmail(req.body.email);
    const phone = normalizePhone(req.body.phone);

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, message: 'A valid email is required' });
    }

    if (!validatePhone(phone)) {
      return res.status(400).json({ success: false, message: 'A valid phone number is required' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    const [existingByEmail, existingByPhone] = await Promise.all([
      findUserByEmail(email),
      findUserByPhone(phone),
    ]);

    if (existingByEmail || existingByPhone) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await createUser({
      name,
      email,
      phone,
      password: hashedPassword,
      subscription: 'free',
    });

    const token = signUserToken(user);
    setAuthCookie(res, token);
    await sendWelcomeEmail(sanitizeUser(user));

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, message: 'A valid email is required' });
    }

    const user = await findUserByEmail(email);
    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = signUserToken(user);
    setAuthCookie(res, token);

    return res.json({
      success: true,
      message: 'Login successful',
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Login failed' });
  }
});

router.post('/send-otp', async (req, res) => {
  try {
    const phone = normalizePhone(req.body.phone);

    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number required' });
    }

    if (!validatePhone(phone)) {
      return res.status(400).json({ success: false, message: 'A valid phone number is required' });
    }

    const otp = generateOTP();
    const codeHash = hashOtp(phone, otp);
    const existingUser = await findUserByPhone(phone);
    await saveOtp(phone, codeHash, new Date(Date.now() + 5 * 60 * 1000), existingUser?.id || null);

    sendOTP(phone, otp);

    return res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Send OTP error:', error);
    return res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const phone = normalizePhone(req.body.phone);
    const { otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone and OTP required' });
    }

    if (!validatePhone(phone)) {
      return res.status(400).json({ success: false, message: 'A valid phone number is required' });
    }

    const stored = await findOtpByPhone(phone);
    if (!stored) {
      return res.status(400).json({ success: false, message: 'OTP not found or expired' });
    }

    if (new Date(stored.expiresAt).getTime() < Date.now()) {
      await deleteOtpByPhone(phone);
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    if (stored.codeHash !== hashOtp(phone, otp)) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    await deleteOtpByPhone(phone);
    const user = await findOrCreatePhoneUser(phone);

    const token = signUserToken(user);
    setAuthCookie(res, token);

    return res.json({
      success: true,
      message: 'Login successful',
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({ success: false, message: 'Verification failed' });
  }
});

router.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(503).json({
      success: false,
      message: 'Google OAuth is not configured on this server',
    });
  }

  return passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next);
});

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth?error=google_oauth_failed` }),
  (req, res) => {
    const token = signUserToken(req.user);
    setAuthCookie(res, token);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`);
  }
);

router.post('/logout', (req, res) => {
  clearAuthCookie(res);
  res.json({ success: true, message: 'Logged out' });
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await findUserById(req.user.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

module.exports = router;
