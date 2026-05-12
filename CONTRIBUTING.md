# Contributing to VoltexBazar

## Workflow

1. Fork and create a branch: `git checkout -b feat/your-feature`
2. Commit using [Conventional Commits](https://www.conventionalcommits.org/)
3. Open a Pull Request against `main`
4. CI must pass before merging
5. One reviewer approval required

## Commit Convention

```
feat: add agent listing page
fix: resolve payment webhook race condition
docs: update deployment guide
ci: add backend test step
chore: upgrade prisma to latest
```

## Local Development

### Frontend
```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

### Backend
```bash
cd server
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev      # http://localhost:4000
```

## Code Style

- TypeScript strict mode
- Tailwind CSS only (no inline styles)
- No direct commits to `main`
- All DB changes via Prisma migrations

## Security

- Never commit `.env` files
- Report vulnerabilities privately via GitHub Security Advisories
