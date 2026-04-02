const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required to start the VoltexBazar server');
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const prisma = new PrismaClient({ adapter });

const analytics = new Map();
const deployedAgents = new Map();

const sampleAgents = [
  { id: '1', name: 'Client Hunter AI', description: 'Finds & contacts leads daily', price: 49, category: 'Marketing', icon: 'lead-target', tags: ['leads', 'outreach'] },
  { id: '2', name: 'WhatsApp Sales Pro', description: 'Automates sales conversations', price: 79, category: 'Sales', icon: 'message-square', tags: ['whatsapp', 'sales'] },
  { id: '3', name: 'Content Generator', description: 'Creates content automatically', price: 39, category: 'Content', icon: 'pen-tool', tags: ['content', 'blog'] },
  { id: '4', name: 'Data Analyst AI', description: 'Processes data and generates insights', price: 99, category: 'Analytics', icon: 'bar-chart-3', tags: ['data', 'analytics'] },
  { id: '5', name: 'Support Bot', description: 'Handles customer queries 24/7', price: 59, category: 'Support', icon: 'headphones', tags: ['support', 'chatbot'] },
  { id: '6', name: 'Email Marketer', description: 'Automated email campaigns', price: 45, category: 'Marketing', icon: 'mail', tags: ['email', 'marketing'] },
];

async function initializeSampleAgents() {
  const existingAgents = await prisma.agent.count();
  if (existingAgents > 0) {
    return;
  }

  await prisma.agent.createMany({
    data: sampleAgents,
    skipDuplicates: true,
  });
}

function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || null,
    avatar: user.avatar || null,
    subscription: user.subscription || 'free',
    createdAt: user.createdAt,
  };
}

async function findUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}

async function findUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

async function findUserByPhone(phone) {
  return prisma.user.findUnique({ where: { phone } });
}

async function findUserByGoogleId(googleId) {
  return prisma.user.findUnique({ where: { googleId } });
}

async function createUser(data) {
  return prisma.user.create({ data });
}

async function findOrCreatePhoneUser(phone) {
  const existing = await findUserByPhone(phone);
  if (existing) {
    return existing;
  }

  return prisma.user.create({
    data: {
      name: 'User',
      phone,
      email: `${phone}@voltexbazar.local`,
      subscription: 'free',
    },
  });
}

async function upsertGoogleUser(profile) {
  const email = profile.emails?.[0]?.value || `${profile.id}@voltexbazar.local`;
  const avatar = profile.photos?.[0]?.value || null;

  const existingByGoogleId = await findUserByGoogleId(profile.id);
  if (existingByGoogleId) {
    return prisma.user.update({
      where: { id: existingByGoogleId.id },
      data: {
        email,
        name: profile.displayName || existingByGoogleId.name,
        avatar,
      },
    });
  }

  const existingByEmail = await findUserByEmail(email);
  if (existingByEmail) {
    return prisma.user.update({
      where: { id: existingByEmail.id },
      data: {
        googleId: profile.id,
        name: profile.displayName || existingByEmail.name,
        avatar,
      },
    });
  }

  return prisma.user.create({
    data: {
      name: profile.displayName || 'Voltex User',
      email,
      googleId: profile.id,
      avatar,
      subscription: 'free',
    },
  });
}

async function findOrCreateAnalytics(userId, metricsFactory) {
  const existing = await prisma.analytics.findFirst({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });

  if (existing) {
    analytics.set(userId, existing.metrics);
    return existing.metrics;
  }

  const metrics = metricsFactory();
  await prisma.analytics.create({
    data: {
      userId,
      metrics,
    },
  });
  analytics.set(userId, metrics);
  return metrics;
}

async function saveOtp(phone, codeHash, expiresAt, userId = null) {
  return prisma.oTP.upsert({
    where: { phone },
    update: {
      codeHash,
      expiresAt,
      userId,
    },
    create: {
      phone,
      codeHash,
      expiresAt,
      userId,
    },
  });
}

async function findOtpByPhone(phone) {
  return prisma.oTP.findUnique({ where: { phone } });
}

async function deleteOtpByPhone(phone) {
  try {
    await prisma.oTP.delete({ where: { phone } });
  } catch (error) {
    if (error.code !== 'P2025') {
      throw error;
    }
  }
}

async function getAgents() {
  return prisma.agent.findMany({ orderBy: { createdAt: 'asc' } });
}

async function findAgentById(id) {
  return prisma.agent.findUnique({ where: { id } });
}

initializeSampleAgents().catch((error) => {
  console.error('Failed to initialize sample agents', error);
});

module.exports = {
  prisma,
  analytics,
  deployedAgents,
  sampleAgents,
  sanitizeUser,
  findUserById,
  findUserByEmail,
  findUserByPhone,
  findUserByGoogleId,
  createUser,
  findOrCreatePhoneUser,
  upsertGoogleUser,
  findOrCreateAnalytics,
  saveOtp,
  findOtpByPhone,
  deleteOtpByPhone,
  getAgents,
  findAgentById,
};
