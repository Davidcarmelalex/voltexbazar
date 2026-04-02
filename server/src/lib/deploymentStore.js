const { prisma } = require('./store');

async function saveSubscription(subscriptionData) {
  return prisma.subscription.upsert({
    where: { paymentId: subscriptionData.paymentId },
    update: {
      plan: subscriptionData.plan,
      status: subscriptionData.status,
      updatedAt: new Date(),
    },
    create: {
      id: subscriptionData.id,
      userId: subscriptionData.userId,
      agentId: subscriptionData.agentId,
      agentName: subscriptionData.agentName,
      plan: subscriptionData.plan,
      paymentId: subscriptionData.paymentId,
      status: subscriptionData.status,
    },
  });
}

async function saveDeployment(deploymentData) {
  return prisma.deployedAgent.upsert({
    where: { id: deploymentData.id },
    update: {
      config: deploymentData.config,
      status: deploymentData.status,
      vpsIp: deploymentData.vpsIp,
      containerName: deploymentData.containerName,
      deploymentMode: deploymentData.deploymentMode,
      execution: deploymentData.execution,
      updatedAt: new Date(),
    },
    create: {
      id: deploymentData.id,
      agentId: deploymentData.agentId,
      userId: deploymentData.userId,
      subscriptionId: deploymentData.subscriptionId,
      config: deploymentData.config,
      status: deploymentData.status,
      vpsIp: deploymentData.vpsIp,
      containerName: deploymentData.containerName,
      deploymentMode: deploymentData.deploymentMode,
      execution: deploymentData.execution,
    },
  });
}

async function findSubscriptionByUserAndAgent(userId, agentId) {
  return prisma.subscription.findFirst({
    where: { userId, agentId },
    orderBy: { createdAt: 'desc' },
  });
}

async function findActiveSubscriptionByUser(userId) {
  return prisma.subscription.findFirst({
    where: { userId, status: 'active' },
    orderBy: { createdAt: 'desc' },
  });
}

async function findDeploymentById(id) {
  return prisma.deployedAgent.findUnique({
    where: { id },
    include: { agent: true },
  });
}

async function findDeploymentsByUser(userId) {
  return prisma.deployedAgent.findMany({
    where: { userId },
    include: { agent: true },
    orderBy: { createdAt: 'desc' },
  });
}

module.exports = {
  saveSubscription,
  saveDeployment,
  findSubscriptionByUserAndAgent,
  findActiveSubscriptionByUser,
  findDeploymentById,
  findDeploymentsByUser,
};
