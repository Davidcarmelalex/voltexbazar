# VoltexBazar Architecture

## Objective

Deliver a marketplace where buyers can discover AI agents, authenticate, generate payment orders, activate subscriptions, and trigger deployment without dealing with infrastructure complexity directly.

## System Model

### Frontend

The frontend handles:

- marketplace discovery
- pricing and positioning
- authentication flows
- wallet and transaction visibility
- subscription/deployment status

### Backend

The backend handles:

- user auth and identity
- OTP and password login flows
- agent catalog API
- payment order creation and webhook settlement
- shared treasury custody plus user-level virtual sub-wallet assignment
- subscription activation
- deployment lifecycle records

### Database

PostgreSQL stores:

- users
- otp records
- analytics
- agents
- deployed agents
- payments
- wallets
- subscriptions

User wallet records represent the internal ledger state. Deposits currently settle into the shared treasury wallet `0xa8CBFC06285A23E892Fb74c34a63F28988Beb9C6`, and each user is assigned a stable virtual sub-wallet reference for attribution and reconciliation.

## Deployment Model

- Next.js frontend on localhost
- Express backend on localhost
- Nginx proxies public traffic
- PostgreSQL runs as the system of record

## Production Constraints

- frontend and backend must have separate dependency scopes
- payment and webhook secrets must be production-only
- deployment operations must be auditable
- health/readiness endpoints must be available for service supervision

## Next Architecture Improvements

- replace placeholder deployment execution with real provider integrations
- formalize seed data for marketplace agents
- add admin workflows for catalog and order operations
- add structured observability and incident reporting
- move from virtual sub-wallet references to real managed deposit addresses only if secure key-management infrastructure is introduced
