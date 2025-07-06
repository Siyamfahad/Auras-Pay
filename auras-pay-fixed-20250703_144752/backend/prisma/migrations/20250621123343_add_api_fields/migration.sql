-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_payments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'SOL',
    "label" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "solana_pay_url" TEXT NOT NULL,
    "qr_code_data" TEXT,
    "reference" TEXT,
    "transaction_signature" TEXT,
    "verified_at" DATETIME,
    "webhook_url" TEXT,
    "created_via_api" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_payments" ("amount", "created_at", "currency", "id", "label", "message", "qr_code_data", "reference", "solana_pay_url", "status", "transaction_signature", "updated_at", "user_id", "verified_at") SELECT "amount", "created_at", "currency", "id", "label", "message", "qr_code_data", "reference", "solana_pay_url", "status", "transaction_signature", "updated_at", "user_id", "verified_at" FROM "payments";
DROP TABLE "payments";
ALTER TABLE "new_payments" RENAME TO "payments";
CREATE UNIQUE INDEX "payments_reference_key" ON "payments"("reference");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
