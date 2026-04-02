# VoltexBazar

VoltexBazar is the AI agent marketplace inside the Voltex Network ecosystem.

## Product Positioning

VoltexBazar is designed for non-technical operators, service businesses, and modern commerce teams that want deployable AI agents without having to become infrastructure engineers first.

- public domain: `voltexbazar.io`
- umbrella ecosystem: `Voltex Network`
- primary launch market: UAE
- product scope: marketplace, checkout, subscription activation, deployment flow, operator dashboard
- payment scope for now: `USDT` and `USDC` on EVM-compatible chains only

## Stack

### Frontend

- Next.js 16
- React 19
- Tailwind CSS 4
- app router

### Backend

- Express
- Prisma
- PostgreSQL
- JWT auth
- payment order + wallet flow
- deployment orchestration layer

## Repository Layout

```text
src/                    Next.js frontend
server/                 Express + Prisma backend
deploy/nginx/           public reverse proxy config
deploy/systemd/         frontend and backend service units
```

## Local Development

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

## Production Baseline

- frontend served behind Nginx
- backend served on a private port
- PostgreSQL as source of truth
- webhook-secured crypto payment confirmation
- treasury wallet defaulted to `0xa8CBFC06285A23E892Fb74c34a63F28988Beb9C6`
- user deposits tracked through persistent virtual sub-wallet references under the shared treasury
- deployment lifecycle visible to authenticated users

## Key Documents

- [Architecture](./ARCHITECTURE.md)
- [Deployment](./DEPLOYMENT.md)
- [Progress](./PROGRESS.md)
- [Deploy folder](./deploy/README.md)

## Current Direction

VoltexBazar is being shaped into a world-class marketplace repo and a clean production deployment target. The goal is not just a polished landing page, but a credible end-to-end product with strong repo discipline, deployment clarity, and an operator-grade user journey.

The current payment model is treasury-routed: users are assigned internal sub-wallet references for reconciliation, while real on-chain custody still lands in the shared EVM treasury wallet above.
