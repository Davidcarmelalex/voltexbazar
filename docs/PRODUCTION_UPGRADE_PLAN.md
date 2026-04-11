# Voltex Core — Production Upgrade Plan (CTO Roadmap)

## PHASE 1 — SECURITY HARDENING (Week 1)

- Replace plain passwords with bcrypt hashing
- Move secrets to environment variables
- Add JWT refresh tokens
- Add request validation
- Add rate limiting (NGINX)

---

## PHASE 2 — STABILITY & OBSERVABILITY (Week 2)

- Add structured logging (Python logging)
- Add error handling (no silent fails)
- Add request tracing IDs
- Integrate basic monitoring (Prometheus optional)

---

## PHASE 3 — DATA LAYER UPGRADE (Week 3)

- Move user storage to PostgreSQL
- Add tables:
  - users
  - sessions
  - memory
  - payments
- Add migrations (Alembic)

---

## PHASE 4 — VECTOR MEMORY PRODUCTION (Week 4)

- Replace in-memory vector store
- Use FAISS or pgvector
- Add similarity threshold
- Add memory summarization

---

## PHASE 5 — SERVICE HARDENING (Week 5)

- Add retries + timeouts for service calls
- Add circuit breaker pattern
- Add async optimization

---

## PHASE 6 — WALLET ENGINE INTELLIGENCE (Week 6)

- Add real risk signals:
  - contract interactions
  - known scam DB
  - anomaly detection
- Add multi-chain support

---

## PHASE 7 — FRONTEND PRODUCTION (Week 7)

- Add authentication flow (login/signup UI)
- Add dashboard modules:
  - memory viewer
  - wallet analyzer
- Improve UX (dark theme, modular UI)

---

## PHASE 8 — INFRA & SCALING (Week 8)

- Add Redis (caching + queue)
- Add background workers
- Add horizontal scaling (multiple containers)

---

## PHASE 9 — CI/CD PIPELINE (Week 9)

- GitHub Actions for:
  - build
  - test
  - deploy
- Auto-deploy to VPS

---

## FINAL STATE

- Secure
- Scalable
- Observable
- Monetizable

This transitions Voltex Core from prototype → production-grade SaaS.
