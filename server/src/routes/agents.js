const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { deployedAgents, getAgents, findAgentById } = require('../lib/store');
const { requireAuth } = require('../lib/auth');
const {
  saveSubscription,
  saveDeployment,
  findSubscriptionByUserAndAgent,
  findActiveSubscriptionByUser,
  findDeploymentById,
  findDeploymentsByUser,
} = require('../lib/deploymentStore');
const { findPaymentById } = require('../lib/paymentStore');
const { provisionDeployment } = require('../lib/deploymentManager');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let allAgents = await getAgents();

    if (category && category !== 'All') {
      allAgents = allAgents.filter((agent) => agent.category === category);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      allAgents = allAgents.filter(
        (agent) =>
          agent.name.toLowerCase().includes(searchLower) ||
          agent.description.toLowerCase().includes(searchLower)
      );
    }

    if (sort === 'price-low') {
      allAgents.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      allAgents.sort((a, b) => b.price - a.price);
    }

    return res.json({ success: true, agents: allAgents });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch agents' });
  }
});

router.get('/user/:userId', requireAuth, async (req, res) => {
  try {
    if (req.user.userId !== req.params.userId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const userDeployments = await findDeploymentsByUser(req.params.userId);
    return res.json({ success: true, deployments: userDeployments });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch deployments' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const agent = await findAgentById(req.params.id);
    if (!agent) {
      return res.status(404).json({ success: false, message: 'Agent not found' });
    }

    return res.json({ success: true, agent });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch agent' });
  }
});

router.post('/deploy', requireAuth, async (req, res) => {
  try {
    const { agentId, config } = req.body;
    const userId = req.user.userId;

    if (!agentId) {
      return res.status(400).json({ success: false, message: 'Agent ID required' });
    }

    const agent = await findAgentById(agentId);
    if (!agent) {
      return res.status(404).json({ success: false, message: 'Agent not found' });
    }

    const activeSubscription =
      (await findSubscriptionByUserAndAgent(userId, agentId)) || (await findActiveSubscriptionByUser(userId));

    if (!activeSubscription || activeSubscription.status !== 'active') {
      return res.status(402).json({
        success: false,
        message: 'Active subscription required before deployment',
      });
    }

    const deploymentId = uuidv4();
    const deployment = {
      id: deploymentId,
      agentId,
      userId,
      subscriptionId: activeSubscription.id,
      config: config || {},
      status: 'provisioning',
      vpsIp: null,
      containerName: null,
      deploymentMode: null,
      execution: null,
    };

    deployedAgents.set(deploymentId, { ...deployment, agent });
    const persistedDeployment = await saveDeployment(deployment);

    res.status(201).json({
      success: true,
      message: 'Agent deployment started',
      deployment: {
        ...persistedDeployment,
        agent,
      },
    });

    setImmediate(async () => {
      try {
        const result = await provisionDeployment({
          userId,
          agent,
          subscription: activeSubscription,
        });

        const updatedDeployment = {
          ...deployment,
          status: result.status,
          containerName: result.containerName,
          deploymentMode: result.deploymentSpec.mode,
          execution: result.execution,
        };

        deployedAgents.set(deploymentId, { ...updatedDeployment, agent });
        await saveDeployment(updatedDeployment);

        const io = req.app.get('io');
        io.to(userId).emit('agent-deployed', {
          deploymentId,
          status: updatedDeployment.status,
          containerName: updatedDeployment.containerName,
        });
      } catch (error) {
        deployedAgents.set(deploymentId, { ...deployment, agent, status: 'failed' });
        await saveDeployment({ ...deployment, status: 'failed' });
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Deployment failed' });
  }
});

router.post('/run', requireAuth, async (req, res) => {
  try {
    const { deploymentId, input } = req.body;
    const deployment = (await findDeploymentById(deploymentId)) || deployedAgents.get(deploymentId);
    if (!deployment) {
      return res.status(404).json({ success: false, message: 'Deployment not found' });
    }

    if (deployment.userId !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    if (deployment.status !== 'running') {
      return res.status(400).json({ success: false, message: 'Agent is not running' });
    }

    return res.json({
      success: true,
      output: `Processed: ${input}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Execution failed' });
  }
});

router.post('/stop', requireAuth, async (req, res) => {
  try {
    const { deploymentId } = req.body;
    const deployment = (await findDeploymentById(deploymentId)) || deployedAgents.get(deploymentId);
    if (!deployment) {
      return res.status(404).json({ success: false, message: 'Deployment not found' });
    }

    if (deployment.userId !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const updated = {
      ...deployment,
      status: 'stopped',
    };
    deployedAgents.set(deploymentId, updated);
    await saveDeployment(updated);

    return res.json({ success: true, message: 'Agent stopped', deployment: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to stop agent' });
  }
});

router.post('/start', requireAuth, async (req, res) => {
  try {
    const { deploymentId } = req.body;
    const deployment = (await findDeploymentById(deploymentId)) || deployedAgents.get(deploymentId);
    if (!deployment) {
      return res.status(404).json({ success: false, message: 'Deployment not found' });
    }

    if (deployment.userId !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const updated = {
      ...deployment,
      status: 'running',
    };
    deployedAgents.set(deploymentId, updated);
    await saveDeployment(updated);

    return res.json({ success: true, message: 'Agent started', deployment: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to start agent' });
  }
});

router.post('/activate-subscription', requireAuth, async (req, res) => {
  try {
    const { agentId, plan, paymentId } = req.body;
    const userId = req.user.userId;

    if (!agentId || !plan || !paymentId) {
      return res.status(400).json({ success: false, message: 'agentId, plan, and paymentId are required' });
    }

    const [agent, payment, existing] = await Promise.all([
      findAgentById(agentId),
      findPaymentById(paymentId),
      findSubscriptionByUserAndAgent(userId, agentId),
    ]);

    if (!agent) {
      return res.status(404).json({ success: false, message: 'Agent not found' });
    }

    if (!payment || payment.userId !== userId) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    if (payment.status !== 'completed') {
      return res.status(409).json({ success: false, message: 'Payment has not been confirmed yet' });
    }

    if (payment.plan !== plan) {
      return res.status(400).json({ success: false, message: 'Payment plan mismatch' });
    }

    if (existing && existing.status === 'active') {
      return res.json({ success: true, subscription: existing });
    }

    const subscription = await saveSubscription({
      id: existing?.id || uuidv4(),
      userId,
      agentId,
      agentName: agent.name,
      plan,
      paymentId,
      status: 'active',
    });

    return res.status(201).json({ success: true, subscription });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to activate subscription' });
  }
});

router.get('/subscription/me', requireAuth, async (req, res) => {
  const subscription = await findActiveSubscriptionByUser(req.user.userId);
  res.json({ success: true, subscription });
});

module.exports = router;
