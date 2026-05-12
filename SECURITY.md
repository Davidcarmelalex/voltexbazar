# Security Policy

## Reporting a Vulnerability

**Do NOT open a public issue for security vulnerabilities.**

Report privately via GitHub Security Advisories:
1. Go to the [Security tab](../../security/advisories/new)
2. Click "Report a vulnerability"

We respond within 48 hours.

## Scope

- VoltexBazar marketplace frontend and backend
- Payment and wallet infrastructure
- Agent deployment orchestration
- User authentication and JWT tokens

## High Priority Areas

Given the financial nature of VoltexBazar (crypto payments, user wallets), we treat the following as critical:
- Authentication bypass
- Payment flow manipulation
- Smart contract interaction vulnerabilities
- SQL injection / data exposure

## Out of Scope

- Bugs without security impact
- Third-party libraries (report upstream)
