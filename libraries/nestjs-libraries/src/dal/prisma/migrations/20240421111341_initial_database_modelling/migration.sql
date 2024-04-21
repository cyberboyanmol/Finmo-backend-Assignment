-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "is_email_verified" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "refresh_token_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("refresh_token_id")
);

-- CreateTable
CREATE TABLE "UserAccount" (
    "account_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "account_balance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAccount_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "ForexExchangeRates" (
    "id" TEXT NOT NULL,
    "expire_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ForexExchangeRates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrencyExchangeRate" (
    "id" TEXT NOT NULL,
    "from_currency_code" TEXT NOT NULL,
    "from_currency_name" TEXT NOT NULL,
    "to_currency_code" TEXT NOT NULL,
    "to_currency_name" TEXT NOT NULL,
    "exchange_rate" DECIMAL(65,30) NOT NULL,
    "last_refreshed_at" TIMESTAMP(3) NOT NULL,
    "time_zone" TEXT NOT NULL,
    "bid_price" DECIMAL(65,30) NOT NULL,
    "ask_price" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "forex_exchange_rate_id" TEXT NOT NULL,

    CONSTRAINT "CurrencyExchangeRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount_user_id_key" ON "UserAccount"("user_id");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAccount" ADD CONSTRAINT "UserAccount_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrencyExchangeRate" ADD CONSTRAINT "CurrencyExchangeRate_forex_exchange_rate_id_fkey" FOREIGN KEY ("forex_exchange_rate_id") REFERENCES "ForexExchangeRates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
