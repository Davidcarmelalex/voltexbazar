require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const http = require('http');
const { Server } = require('socket.io');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const logger = require('./lib/logger');

const authRoutes = require('./routes/auth');
const agentRoutes = require('./routes/agents');
const paymentRoutes = require('./routes/payment');
const vpsRoutes = require('./routes/vps');
const dashboardRoutes = require('./routes/dashboard');
const { upsertGoogleUser } = require('./lib/store');
const { prisma } = require('./lib/store');

const app = express();
const server = http.createServer(app);
app.set('trust proxy', 1);
app.disable('x-powered-by');
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json({
  limit: '1mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  },
}));
app.use(passport.initialize());

app.use((req, res, next) => {
  const startedAt = Date.now();
  const requestId = req.headers['x-request-id'] || `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  req.requestId = requestId;
  res.setHeader('x-request-id', requestId);

  res.on('finish', () => {
    logger.info('http_request', {
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      userId: req.user?.userId || null,
    });
  });

  next();
});

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/api/auth/google/callback`,
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await upsertGoogleUser(profile);
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth', authLimiter);

// Make io accessible to routes
app.set('io', io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/vps', vpsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'ok', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({ status: 'degraded', database: 'down', timestamp: new Date().toISOString() });
  }
});

app.get('/api/ready', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ready: true, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({ ready: false, timestamp: new Date().toISOString() });
  }
});

app.get('/api/metrics', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      success: true,
      metrics: {
        uptimeSeconds: Math.round(process.uptime()),
        memory: process.memoryUsage(),
        nodeVersion: process.version,
        database: 'ok',
      },
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      metrics: {
        uptimeSeconds: Math.round(process.uptime()),
        memory: process.memoryUsage(),
        nodeVersion: process.version,
        database: 'down',
      },
    });
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  logger.info('socket_connected', { socketId: socket.id });

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    logger.info('socket_join_room', { socketId: socket.id, roomId });
  });

  socket.on('disconnect', () => {
    logger.info('socket_disconnected', { socketId: socket.id });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('unhandled_error', {
    method: req.method,
    path: req.originalUrl,
    stack: err.stack,
  });
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 4000;

const listener = server.listen(PORT, () => {
  logger.info('server_started', {
    port: PORT,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development',
  });
});

async function shutdown(signal) {
  logger.warn('server_shutdown_started', { signal });
  listener.close(async () => {
    await prisma.$disconnect();
    io.close();
    logger.info('server_shutdown_complete', { signal });
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

module.exports = { app, io };
