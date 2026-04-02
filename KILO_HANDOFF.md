VoltexBazar handoff for Kilo Code

Project path
- /root/voltexbazar

Important scope boundary
- Use /root/voltexbazar as the primary source project.
- Treat /root/voltexbazar-deploy as a deploy snapshot/reference only, not the main editable codebase unless needed for comparison.

Primary objective
- Finish the full VoltexBazar product for production readiness:
- frontend
- backend
- auth flows
- marketplace flows
- wallet
- payments
- bots/agent catalog experience
- deployment readiness

What is already present
- Next.js frontend exists.
- Express-style backend exists under /root/voltexbazar/server.
- API routes exist for auth, agents, payment, vps, and dashboard.
- Frontend already calls backend client methods in src/lib/api.ts.
- Build artifacts already exist locally.

Known current gaps and risks
- ROADMAP.md still marks crypto payment system as unfinished.
- Current payment and wallet implementation appears simulated/in-memory and not production-safe.
- Wallet/payment endpoints currently use generated placeholder addresses and in-memory Maps.
- Need to verify all frontend pages are wired to real backend state instead of placeholder/demo data.
- Need to verify bots/agents catalog, checkout, wallet, auth, dashboard, and VPS flows end-to-end.

Requested outcome
- Finish everything necessary to make VoltexBazar feel complete and operational.
- If full real payment rails are not possible with available credentials/env, build the system up to production-ready integration points and document the exact remaining secrets/providers needed.
- Harden backend and deployment setup.
- Prepare or complete Debian deployment if practical.

Specific expectations
- Audit the entire app first.
- Identify missing functionality across frontend and backend.
- Replace obvious placeholder flows with real application logic where feasible.
- Improve the UX where it blocks conversion or product clarity.
- Ensure auth, dashboard, agent listings, wallet, and purchase/payment paths are coherent.
- Decide whether bots/agent purchases should be handled as digital product purchases, subscriptions, or wallet-credit flows based on current architecture.
- Preserve good existing work; do not restart from scratch.

Payments and wallet guidance
- The current implementation is not enough for real money movement.
- Prefer a clean, extensible design with explicit provider boundaries.
- If no production payment credentials are available, implement a proper provider abstraction and complete as much as possible without fake production claims.
- Document exactly what is still required for true live payments.

Definition of done
- The main VoltexBazar app in /root/voltexbazar is materially more complete.
- Core journeys are functional or clearly documented where secrets/providers are missing.
- The codebase is organized enough for production continuation.
- Remaining blockers are concrete, minimal, and explicit.
