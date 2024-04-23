/*
  Warnings:

  - You are about to drop the column `expire_at` on the `ForexExchangeRates` table. All the data in the column will be lost.
  - You are about to drop the `UserAccount` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[forex_exchange_rates_id]` on the table `ForexExchangeRates` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[forex_exchange_rates_expires_at]` on the table `ForexExchangeRates` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `from_currency_code` on the `CurrencyExchangeRate` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `to_currency_code` on the `CurrencyExchangeRate` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `forex_exchange_rates_expires_at` to the `ForexExchangeRates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `forex_exchange_rates_id` to the `ForexExchangeRates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `ForexExchangeRates` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CurrencyCode" AS ENUM ('AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BRL', 'BSD', 'BTN', 'BWP', 'BZD', 'CAD', 'CDF', 'CHF', 'CLF', 'CLP', 'CNH', 'CNY', 'COP', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP', 'GBP', 'GEL', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HTG', 'HUF', 'ICP', 'IDR', 'ILS', 'INR', 'IQD', 'IRR', 'ISK', 'JEP', 'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR', 'KMF', 'KPW', 'KRW', 'KWD', 'KYD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRO', 'MRU', 'MUR', 'MVR', 'MWK', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RUR', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SDR', 'SEK', 'SGD', 'SHP', 'SLL', 'SOS', 'SRD', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD', 'UYU', 'UZS', 'VND', 'VUV', 'WST', 'XAF', 'XCD', 'XDR', 'XOF', 'XPF', 'YER', 'ZAR', 'ZMW', 'ZWL');

-- DropForeignKey
ALTER TABLE "UserAccount" DROP CONSTRAINT "UserAccount_user_id_fkey";

-- AlterTable
ALTER TABLE "CurrencyExchangeRate" DROP COLUMN "from_currency_code",
ADD COLUMN     "from_currency_code" "CurrencyCode" NOT NULL,
DROP COLUMN "to_currency_code",
ADD COLUMN     "to_currency_code" "CurrencyCode" NOT NULL,
ALTER COLUMN "last_refreshed_at" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ForexExchangeRates" DROP COLUMN "expire_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "forex_exchange_rates_expires_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "forex_exchange_rates_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "UserAccount";

-- CreateTable
CREATE TABLE "UserWallet" (
    "account_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "account_balance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "currency_code" "CurrencyCode" NOT NULL DEFAULT 'USD',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserWallet_pkey" PRIMARY KEY ("account_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserWallet_user_id_key" ON "UserWallet"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ForexExchangeRates_forex_exchange_rates_id_key" ON "ForexExchangeRates"("forex_exchange_rates_id");

-- CreateIndex
CREATE UNIQUE INDEX "ForexExchangeRates_forex_exchange_rates_expires_at_key" ON "ForexExchangeRates"("forex_exchange_rates_expires_at");

-- AddForeignKey
ALTER TABLE "UserWallet" ADD CONSTRAINT "UserWallet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
