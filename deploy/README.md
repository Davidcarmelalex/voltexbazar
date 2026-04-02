# VoltexBazar production deployment

## Topology

- Next.js frontend listens on `127.0.0.1:3000`
- Express API listens on `127.0.0.1:4000`
- Nginx terminates public traffic and proxies `/api/*` and `/socket.io/*` to Express
- PostgreSQL is the system of record for auth, agents, payments, wallet, and subscriptions

## Server bootstrap

1. Install Node.js 20+, PostgreSQL 16+, and Nginx.
2. Create the database and role referenced by `server/.env`.
3. Install dependencies:
   - `npm install`
   - `cd server && npm install`
4. Generate Prisma client and apply migrations:
   - `cd server && npx prisma generate`
   - `cd server && npx prisma migrate deploy`
5. Build the frontend:
   - `npm run build`
6. Install systemd units from `deploy/systemd/`.
7. Install the Nginx site from `deploy/nginx/voltexbazar.conf` and reload Nginx.

## Required production env

- `DATABASE_URL`
- `JWT_SECRET`
- `FRONTEND_URL`
- `PAYMENT_WALLET_ADDRESS`
- `PAYMENT_WEBHOOK_SECRET`
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` if Google login remains enabled

## Readiness checks

- API liveness: `GET /api/health`
- API readiness: `GET /api/ready`
- Frontend: `GET /`

## Monitoring starter set

- systemd service status and restart behavior
- Nginx access/error logs
- API structured logs from stdout or `/var/log/voltexbazar/*.log`
- database availability via `/api/ready`
