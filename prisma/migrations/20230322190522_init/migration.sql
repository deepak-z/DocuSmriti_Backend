-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "wallet" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_wallet_key" ON "users"("wallet");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
