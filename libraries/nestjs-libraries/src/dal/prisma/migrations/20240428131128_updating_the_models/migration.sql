/*
  Warnings:

  - You are about to alter the column `exchange_rate` on the `CurrencyExchangeRate` table. The data in that column could be lost. The data in that column will be cast from `Decimal(1000,8)` to `Decimal(999,8)`.
  - You are about to alter the column `bid_price` on the `CurrencyExchangeRate` table. The data in that column could be lost. The data in that column will be cast from `Decimal(1000,8)` to `Decimal(999,8)`.
  - You are about to alter the column `ask_price` on the `CurrencyExchangeRate` table. The data in that column could be lost. The data in that column will be cast from `Decimal(1000,8)` to `Decimal(999,8)`.
  - You are about to alter the column `account_balance` on the `UserWallet` table. The data in that column could be lost. The data in that column will be cast from `Decimal(1000,8)` to `Decimal(999,100)`.

*/
-- DropForeignKey
ALTER TABLE "CurrencyExchangeRate" DROP CONSTRAINT "CurrencyExchangeRate_forex_exchange_rate_id_fkey";

-- AlterTable
ALTER TABLE "CurrencyExchangeRate" ALTER COLUMN "exchange_rate" SET DATA TYPE DECIMAL(999,8),
ALTER COLUMN "bid_price" SET DATA TYPE DECIMAL(999,8),
ALTER COLUMN "ask_price" SET DATA TYPE DECIMAL(999,8);

-- AlterTable
ALTER TABLE "UserWallet" ALTER COLUMN "account_balance" SET DATA TYPE DECIMAL(999,100);

-- AddForeignKey
ALTER TABLE "CurrencyExchangeRate" ADD CONSTRAINT "CurrencyExchangeRate_forex_exchange_rate_id_fkey" FOREIGN KEY ("forex_exchange_rate_id") REFERENCES "ForexExchangeRates"("forex_exchange_rates_id") ON DELETE RESTRICT ON UPDATE CASCADE;
