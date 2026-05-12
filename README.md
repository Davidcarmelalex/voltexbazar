# VoltexBazar

> The AI agent marketplace for the modern operator.

[![License: MIT](https://img.shields.io/badge/License-MIT-gold.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)]()
[![Part of](https://img.shields.io/badge/Voltex%20Network-FCRI-purple.svg)](https://fcri.science)

VoltexBazar is the **AI agent marketplace** inside the Voltex Network — built for non-technical operators, service businesses, and modern commerce teams that want deployable AI agents without becoming infrastructure engineers.

**Primary launch market: UAE**

---

## Product

```
Operator                     VoltexBazar Platform
  │                                │
  ├── Browse agents ────────────── Marketplace
  ├── Deploy agent ───────────────  Checkout flow
  ├── Pay with USDT/USDC ─────────  Crypto payment
  ├── Monitor operations ─────────  Dashboard
  └── Manage billing ─────────────  Wallet + billing
```

---

## Architecture

### Frontend (`/src`)
```
src/app/
├── page.tsx          Landing page
├── marketplace/      Agent browsing and discovery
├── agent/[id]/       Individual agent pages
├── dashboard/        Operator dashboard
├── wallet/           Crypto wallet management
├── pricing/          Plans and pricing
└── auth/             Authentication
```

### Backend (`/server`)
```
server/src/
├── index.js          Express entry point
├── routes/           API route handlers
├── middleware/        Auth, rate limiting, logging
├── lib/              Utilities and helpers
└── prisma/           Database schema and migrations
```

---

## Stack

**Frontend:** Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · Socket.io

**Backend:** Node.js · Express · Prisma ORM · PostgreSQL · JWT auth

**Payments:** USDT / USDC on EVM chains · Treasury wallet: `0xa8CBFC06285A23E892Fb74c34a63F28988Beb9C6`

**Infra:** Docker Compose · Nginx · PM2 · systemd

---

## Quick Start

### Frontend
```bash
npm install
npm run dev          # http://localhost:3000
```

### Backend
```bash
cd server
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev          # http://localhost:4000
```

### Full stack (Docker)
```bash
docker-compose up
```

---

## Environment Variables

```env
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_TREASURY_WALLET=0xa8CBFC06285A23E892Fb74c34a63F28988Beb9C6

# Backend (server/.env)
DATABASE_URL=postgresql://user:pass@localhost:5432/voltexbazar
JWT_SECRET=your-secret-min-32-chars
PORT=4000
WEBHOOK_SECRET=your-webhook-secret
```

---

## Payment Architecture

VoltexBazar uses a shared treasury wallet with virtual sub-wallet references per user:

1. User requests deposit address → assigned a unique sub-reference under treasury
2. On-chain confirmation detected via webhook
3. Balance credited to user account
4. Agent subscription activated

Supported tokens: USDT (ERC-20), USDC (ERC-20) on EVM chains.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Part of the [Voltex Network](https://fcri.science).
