# CI/CD Setup Instructions

## GitHub Actions CI Pipeline

To activate CI, create `.github/workflows/ci.yml` in this repo with this content:

```yaml
name: CI

on:
  push:
    branches: ["**"]
  pull_request:
    branches: [main]

jobs:
  frontend:
    name: Frontend Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run build

  backend:
    name: Backend Check
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: server
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
          cache-dependency-path: server/package-lock.json
      - run: npm ci
      - run: npx prisma generate
```

## To enable:
```bash
mkdir -p .github/workflows
# paste yaml above into .github/workflows/ci.yml
git add .github/workflows/ci.yml
git commit -m "ci: add GitHub Actions CI pipeline"
git push origin main
```
