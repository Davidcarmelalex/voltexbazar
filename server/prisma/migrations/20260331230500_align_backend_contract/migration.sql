-- Make auth fields compatible with email, OTP, and Google sign-in flows.
ALTER TABLE "User"
    ALTER COLUMN "phone" DROP NOT NULL,
    ALTER COLUMN "password" DROP NOT NULL;

ALTER TABLE "User"
    ADD COLUMN "googleId" TEXT,
    ADD COLUMN "avatar" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "User_googleId_key" ON "User"("googleId");

-- Replace the original OTP shape with the hashed-code contract used by the API.
ALTER TABLE "OTP"
    RENAME COLUMN "otp" TO "codeHash";

ALTER TABLE "OTP"
    RENAME COLUMN "expires" TO "expiresAt";

ALTER TABLE "OTP"
    ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Extend payments to support pending/processing settlement and ledger-safe accounting.
ALTER TABLE "Payment"
    ALTER COLUMN "amount" TYPE DECIMAL(18,8) USING "amount"::DECIMAL(18,8),
    ADD COLUMN "fromAddress" TEXT,
    ADD COLUMN "expectedAmount" DECIMAL(18,8) NOT NULL DEFAULT 0,
    ADD COLUMN "creditedAmount" DECIMAL(18,8) NOT NULL DEFAULT 0,
    ADD COLUMN "ledgerApplied" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN "metadata" JSONB;

UPDATE "Payment"
SET "expectedAmount" = "amount"
WHERE "expectedAmount" = 0;

-- Extend wallets with locked-balance and settlement tracking.
ALTER TABLE "Wallet"
    ALTER COLUMN "balance" TYPE DECIMAL(18,8) USING "balance"::DECIMAL(18,8),
    ALTER COLUMN "pendingBalance" TYPE DECIMAL(18,8) USING "pendingBalance"::DECIMAL(18,8),
    ADD COLUMN "lockedBalance" DECIMAL(18,8) NOT NULL DEFAULT 0,
    ADD COLUMN "lastSettledAt" TIMESTAMP(3);

-- Subscription upserts rely on paymentId uniqueness.
CREATE UNIQUE INDEX IF NOT EXISTS "Subscription_paymentId_key" ON "Subscription"("paymentId");

-- Add withdrawal and ledger tables used by payment settlement and treasury operations.
CREATE TABLE "Withdrawal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "amount" DECIMAL(18,8) NOT NULL,
    "address" TEXT NOT NULL,
    "chain" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending_review',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Withdrawal_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WalletLedgerEntry" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "paymentId" TEXT,
    "withdrawalId" TEXT,
    "type" TEXT NOT NULL,
    "amount" DECIMAL(18,8) NOT NULL,
    "balanceAfter" DECIMAL(18,8) NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WalletLedgerEntry_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Withdrawal"
    ADD CONSTRAINT "Withdrawal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Withdrawal"
    ADD CONSTRAINT "Withdrawal_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "WalletLedgerEntry"
    ADD CONSTRAINT "WalletLedgerEntry_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "WalletLedgerEntry"
    ADD CONSTRAINT "WalletLedgerEntry_withdrawalId_fkey" FOREIGN KEY ("withdrawalId") REFERENCES "Withdrawal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
