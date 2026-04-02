const { execFile } = require('child_process');

const DEPLOY_MODE = process.env.DEPLOYMENT_MODE || 'spec-only';
const DEPLOY_DOCKER_IMAGE = process.env.DEPLOYMENT_DOCKER_IMAGE || 'voltex-customer_agent';
const DEPLOY_NETWORK = process.env.DEPLOYMENT_DOCKER_NETWORK || 'bridge';
const DEPLOY_ENV = process.env.DEPLOYMENT_ENV || 'production';

function slugify(input) {
  return String(input || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

function buildContainerName({ userId, agentId, plan }) {
  return `voltex-${slugify(userId)}-${slugify(agentId)}-${slugify(plan || 'starter')}`.slice(0, 63);
}

function buildDockerArgs({ containerName, userId, agent, subscription }) {
  return [
    'run',
    '-d',
    '--restart',
    'unless-stopped',
    '--name',
    containerName,
    '--network',
    DEPLOY_NETWORK,
    '-e',
    `VOLTEX_USER_ID=${userId}`,
    '-e',
    `VOLTEX_AGENT_ID=${agent.id}`,
    '-e',
    `VOLTEX_AGENT_NAME=${agent.name}`,
    '-e',
    `VOLTEX_PLAN=${subscription.plan}`,
    '-e',
    `VOLTEX_SUBSCRIPTION_ID=${subscription.id}`,
    '-e',
    `NODE_ENV=${DEPLOY_ENV}`,
    DEPLOY_DOCKER_IMAGE,
  ];
}

function executeDockerRun(args) {
  return new Promise((resolve) => {
    execFile('docker', args, { timeout: 30000 }, (error, stdout, stderr) => {
      resolve({
        ok: !error,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        error: error ? error.message : null,
      });
    });
  });
}

async function provisionDeployment({ userId, agent, subscription }) {
  const containerName = buildContainerName({ userId, agentId: agent.id, plan: subscription.plan });
  const dockerArgs = buildDockerArgs({ containerName, userId, agent, subscription });
  const deploymentSpec = {
    mode: DEPLOY_MODE,
    image: DEPLOY_DOCKER_IMAGE,
    network: DEPLOY_NETWORK,
    containerName,
    dockerArgs,
  };

  if (DEPLOY_MODE !== 'docker-run') {
    return {
      status: 'provisioned',
      runtimeStatus: 'spec-only',
      containerName,
      deploymentSpec,
      execution: null,
    };
  }

  const execution = await executeDockerRun(dockerArgs);
  return {
    status: execution.ok ? 'running' : 'provisioning_failed',
    runtimeStatus: execution.ok ? 'running' : 'error',
    containerName,
    deploymentSpec,
    execution,
  };
}

module.exports = {
  provisionDeployment,
};
