-- CreateIndex
CREATE INDEX "CurrencyExchangeRate_forex_exchange_rate_id_idx" ON "CurrencyExchangeRate"("forex_exchange_rate_id");

-- CreateIndex
CREATE INDEX "ForexExchangeRates_updated_at_forex_exchange_rates_id_idx" ON "ForexExchangeRates"("updated_at", "forex_exchange_rates_id");

-- CreateIndex
CREATE INDEX "RefreshToken_token_user_id_idx" ON "RefreshToken"("token", "user_id");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "UserWallet_user_id_idx" ON "UserWallet"("user_id");
