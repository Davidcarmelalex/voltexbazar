const express = require('express');
const router = express.Router();
const { deployedAgents, analytics, findOrCreateAnalytics } = require('../lib/store');
const { requireAuth } = require('../lib/auth');
const { findDeploymentsByUser } = require('../lib/deploymentStore');

function generateMockData() {
  const now = new Date();
  const dailyData = [];

  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    dailyData.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.floor(Math.random() * 2000) + 500,
      leads: Math.floor(Math.random() * 50) + 10,
      tasks: Math.floor(Math.random() * 100) + 20,
    });
  }

  return {
    totalRevenue: dailyData.reduce((sum, entry) => sum + entry.revenue, 0),
    totalLeads: dailyData.reduce((sum, entry) => sum + entry.leads, 0),
    totalTasks: dailyData.reduce((sum, entry) => sum + entry.tasks, 0),
    hoursSaved: Math.floor(Math.random() * 50) + 100,
    dailyData,
  };
}

async function getAnalyticsForUser(userId) {
  const persisted = await findOrCreateAnalytics(userId, generateMockData);
  analytics.set(userId, persisted);
  return persisted;
}

router.get('/stats/:userId', requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const userAnalytics = await getAnalyticsForUser(userId);
    const persistedDeployments = await findDeploymentsByUser(userId);
    const runtimeDeployments = persistedDeployments.length
      ? persistedDeployments
      : Array.from(deployedAgents.values()).filter((deployment) => deployment.userId === userId);
    const activeAgents = runtimeDeployments.filter((deployment) => deployment.status === 'running').length;

    return res.json({
      success: true,
      stats: {
        totalEarnings: userAnalytics.totalRevenue,
        leadsGenerated: userAnalytics.totalLeads,
        hoursSaved: userAnalytics.hoursSaved,
        activeAgents,
        revenueChange: 12.5,
        leadsChange: 8.2,
        hoursChange: 24,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
});

router.get('/revenue/:userId', requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const userAnalytics = await getAnalyticsForUser(userId);

    return res.json({
      success: true,
      data: userAnalytics.dailyData.map((entry) => ({
        name: entry.date.split('-')[2],
        value: entry.revenue,
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch revenue data' });
  }
});

router.get('/activity/:userId', requireAuth, async (req, res) => {
  try {
    if (req.user.userId !== req.params.userId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    return res.json({
      success: true,
      activities: [
        { id: 1, action: 'New lead captured', agent: 'Client Hunter AI', time: '2 min ago', type: 'success' },
        { id: 2, action: 'Sale closed - $299', agent: 'WhatsApp Sales Pro', time: '15 min ago', type: 'success' },
        { id: 3, action: 'Content published', agent: 'Content Generator', time: '1 hour ago', type: 'info' },
        { id: 4, action: 'Support ticket resolved', agent: 'Support Bot', time: '2 hours ago', type: 'success' },
        { id: 5, action: 'Payment received', agent: 'Invoice Generator', time: '3 hours ago', type: 'success' },
      ],
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch activity' });
  }
});

router.get('/agents/:userId', requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const persistedDeployments = await findDeploymentsByUser(userId);
    const sourceDeployments = persistedDeployments.length
      ? persistedDeployments
      : Array.from(deployedAgents.values()).filter((deployment) => deployment.userId === userId);

    const agents = sourceDeployments.map((deployment, index) => ({
      id: deployment.id,
      name: deployment.agent.name,
      status: deployment.status,
      earnings: 250 + index * 125,
      tasks: 8 + index * 3,
      uptime: deployment.status === 'running' ? '99.9%' : '0%',
      icon: deployment.agent.icon,
      containerName: deployment.containerName || null,
      deploymentMode: deployment.deploymentMode || null,
    }));

    return res.json({ success: true, agents });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch agents' });
  }
});

module.exports = router;
