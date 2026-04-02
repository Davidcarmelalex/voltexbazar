# VoltexBazar Deployment

## Domain

- public domain: `voltexbazar.io`

## Services

- `voltexbazar-web`
- `voltexbazar-api`
- `postgresql`
- `nginx`

## Runtime Topology

- frontend binds to `127.0.0.1:3000`
- backend binds to `127.0.0.1:4000`
- nginx terminates TLS and proxies web + API traffic

## Production Checklist

1. install Node.js, PostgreSQL, and Nginx
2. copy backend env from `server/.env.example`
3. create database and apply Prisma migrations
4. build frontend with `npm run build`
5. install systemd services from `deploy/systemd/`
6. install Nginx site config from `deploy/nginx/`
7. validate:
   - `/`
   - `/api/health`
   - `/api/ready`
   - payment config
   - auth flow

## Minimum Secrets

- `DATABASE_URL`
- `JWT_SECRET`
- `PAYMENT_WALLET_ADDRESS`
- `PAYMENT_WEBHOOK_SECRET`
- `PAYMENT_SUPPORTED_TOKENS` configured for `USDT,USDC`
- `PAYMENT_SUPPORTED_CHAINS` configured for the target EVM chains
- optional OAuth keys

## Post-Deploy Validation

- login works
- payment order generation works
- wallet view loads
- marketplace catalog loads
- deployment record creation works
