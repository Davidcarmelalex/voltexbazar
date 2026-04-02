# VoltexBazar Production Blockers Documentation

## Remaining Blockers for Production Deployment

### 1. Missing External Service Credentials
The following environment variables need to be configured for full production functionality:

#### Payment System
- `PAYMENT_TOKEN`: Default cryptocurrency token for payments
- `PAYMENT_SUPPORTED_TOKENS`: Allowed stablecoins for checkout, currently intended as `USDT,USDC`
- `PAYMENT_CHAIN`: Default blockchain network for payment instructions
- `PAYMENT_SUPPORTED_CHAINS`: Allowed EVM-compatible chains for checkout and settlement
- `PAYMENT_WALLET_ADDRESS`: Optional override for the default treasury wallet `0xa8CBFC06285A23E892Fb74c34a63F28988Beb9C6`
- `WEB3_RPC_URL`: Blockchain RPC URL for transaction monitoring (currently commented out)
- `USDT_CONTRACT_ADDRESS`: USDT contract address for the selected chain (currently commented out)
- `USDC_CONTRACT_ADDRESS`: USDC contract address for the selected chain (currently commented out)

#### Communication Services
- `TWILIO_ACCOUNT_SID`: Twilio account SID for WhatsApp/SMS notifications
- `TWILIO_AUTH_TOKEN`: Twilio auth token
- `TWILIO_PHONE_NUMBER`: Twilio phone number for sending messages

#### AI Services
- `OPENAI_API_KEY`: OpenAI API key for powering AI agents

#### VPS/Hosting
- `HOSTINGER_API_KEY`: Hostinger API key for automated VPS provisioning
- `HOSTINGER_API_URL`: Hostinger API URL

#### Authentication
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `GOOGLE_CALLBACK_URL`: Google OAuth callback URL

### 2. Wallet Custody Model Still Needs a Future Upgrade
The application now uses a production-shaped shared treasury wallet plus persistent user-level virtual sub-wallet references for attribution.

This is acceptable for staged rollout and internal accounting, but it is not the same as issuing each user a separate managed on-chain deposit wallet. Moving to real per-user deposit wallets would require secure key generation, encrypted secret storage, rotation policy, and sweep tooling.

### 3. Webhook Security
The crypto payment webhook endpoint (`/api/payment/webhook`) currently lacks proper signature verification. In production, this should validate webhook signatures from the blockchain node/payment processor.

### 4. Payment System Completeness
While the payment architecture is production-ready:
- Real blockchain integration is required for actual transaction monitoring
- The webhook currently simulates confirmations rather than listening to actual blockchain events
- Need to integrate with a blockchain listener service or use webhooks from a wallet service
- Payment matching should eventually rely on real provider metadata, memo/reference support, or managed deposit addresses rather than application-only virtual references

### 5. Email Service
No email service is configured for:
- Email verification
- Password reset
- Notification emails

### 6. Rate Limiting & Security
While basic rate limiting is implemented, production should consider:
- More sophisticated rate limiting per endpoint
- DDoS protection
- Input validation enhancement
- CORS policy refinement for production domains

### 7. Monitoring & Logging
Production deployment should add:
- Structured logging
- Error tracking (e.g., Sentry)
- Performance monitoring
- Health check endpoints

### 8. Deployment Configuration
Need to configure:
- Process manager (PM2, systemd, or Docker)
- Reverse proxy (Nginx)
- SSL certificates
- Environment-specific configurations
- Backup strategies

### 9. Testing
Need to implement:
- Integration tests
- End-to-end tests
- Load testing

## Current State Assessment

### What's Working:
✅ Frontend-Backend API connectivity established
✅ Authentication flows (email/password, OTP, Google OAuth skeleton)
✅ Agent marketplace and deployment simulation
✅ Payment architecture with proper address generation and expiration
✅ Wallet system with balance tracking
✅ Shared treasury wallet configured at `0xa8CBFC06285A23E892Fb74c34a63F28988Beb9C6`
✅ Stable virtual sub-wallet references assigned per user for attribution
✅ Dashboard with real-time data fetching
✅ WebSocket for real-time updates
✅ File-based persistence for payments and wallets (better than pure in-memory)

### What Needs External Configuration:
❌ Actual cryptocurrency payment processing
❌ Real VPS provisioning via Hostinger API
❌ External communication services (WhatsApp/Telegram/Email)
❌ External AI services for agent functionality

## Recommendation

The application is architecturally ready for production with the following approach:
1. Set up PostgreSQL database and migrate from in-memory storage
2. Configure the minimum required environment variables for desired functionality
3. Implement proper webhook security for payment processing
4. Add a real chain listener or provider-backed settlement source for the configured treasury wallet
5. Deploy with proper monitoring and scaling considerations
6. Add missing services incrementally as needed

The core product flows (authentication, agent browsing, deployment simulation, payment generation) are functional and can provide value even without all external services configured.
