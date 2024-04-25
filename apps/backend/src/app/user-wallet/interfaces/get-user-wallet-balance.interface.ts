import { CurrencyCode } from '@prisma/client';

export interface GetUserWalletBalanceData {
  forex_exchange_rates_expires_at: string;
  forex_exchange_rates_id: string;
  balances: Record<CurrencyCode, number>;
}
