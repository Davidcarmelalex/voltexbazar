const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { PersistentMap } = require('../lib/persistentMap');
const { requireAuth } = require('../lib/auth');

const vpsInstances = new PersistentMap('vpsInstances.json', 'id');

// VPS plans
const plans = {
  basic: { cpu: 1, ram: 1, storage: 20, price: 9.99 },
  pro: { cpu: 2, ram: 2, storage: 40, price: 19.99 },
  enterprise: { cpu: 4, ram: 4, storage: 80, price: 39.99 }
};

// Create VPS (simulated - integrate with Hostinger API in production)
router.post('/create', requireAuth, async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.user.userId;

    if (!plan) {
      return res.status(400).json({ success: false, message: 'Plan required' });
    }

    const planConfig = plans[plan] || plans.basic;
    const vpsId = uuidv4();

    // Simulate VPS creation
    const vps = {
      id: vpsId,
      userId,
      plan,
      specs: planConfig,
      ip: `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      status: 'creating',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    vpsInstances.set(vpsId, vps);

    // Simulate provisioning delay
    setTimeout(() => {
      vps.status = 'running';
      vps.updatedAt = new Date().toISOString();
      console.log(`✅ VPS ${vpsId} is now running at ${vps.ip}`);
    }, 10000);

    res.status(201).json({
      success: true,
      message: 'VPS creation started',
      vps
    });
  } catch (error) {
    console.error('VPS create error:', error);
    res.status(500).json({ success: false, message: 'Failed to create VPS' });
  }
});

// Get VPS status
router.get('/status/:vpsId', (req, res) => {
  try {
    const vps = vpsInstances.get(req.params.vpsId);
    if (!vps) {
      return res.status(404).json({ success: false, message: 'VPS not found' });
    }
    res.json({ success: true, vps });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get VPS status' });
  }
});

// Get user VPS
router.get('/user/:userId', requireAuth, (req, res) => {
  try {
    if (req.user.userId !== req.params.userId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const userVps = Array.from(vpsInstances.values())
      .filter(v => v.userId === req.params.userId);
    res.json({ success: true, vps: userVps });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get VPS' });
  }
});

// Stop VPS
router.post('/stop', (req, res) => {
  try {
    const { vpsId } = req.body;
    const vps = vpsInstances.get(vpsId);
    
    if (!vps) {
      return res.status(404).json({ success: false, message: 'VPS not found' });
    }

    vps.status = 'stopped';
    vps.updatedAt = new Date().toISOString();

    res.json({ success: true, message: 'VPS stopped', vps });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to stop VPS' });
  }
});

// Start VPS
router.post('/start', (req, res) => {
  try {
    const { vpsId } = req.body;
    const vps = vpsInstances.get(vpsId);
    
    if (!vps) {
      return res.status(404).json({ success: false, message: 'VPS not found' });
    }

    vps.status = 'running';
    vps.updatedAt = new Date().toISOString();

    res.json({ success: true, message: 'VPS started', vps });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to start VPS' });
  }
});

// Restart VPS
router.post('/restart', (req, res) => {
  try {
    const { vpsId } = req.body;
    const vps = vpsInstances.get(vpsId);
    
    if (!vps) {
      return res.status(404).json({ success: false, message: 'VPS not found' });
    }

    vps.status = 'restarting';
    vps.updatedAt = new Date().toISOString();

    // Simulate restart
    setTimeout(() => {
      vps.status = 'running';
      vps.updatedAt = new Date().toISOString();
    }, 5000);

    res.json({ success: true, message: 'VPS restarting', vps });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to restart VPS' });
  }
});

// Delete VPS
router.delete('/:vpsId', (req, res) => {
  try {
    const vps = vpsInstances.get(req.params.vpsId);
    
    if (!vps) {
      return res.status(404).json({ success: false, message: 'VPS not found' });
    }

    vps.status = 'deleted';
    vps.deletedAt = new Date().toISOString();

    res.json({ success: true, message: 'VPS deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete VPS' });
  }
});

// Get available plans
router.get('/plans', (req, res) => {
  res.json({ success: true, plans });
});

module.exports = router;
