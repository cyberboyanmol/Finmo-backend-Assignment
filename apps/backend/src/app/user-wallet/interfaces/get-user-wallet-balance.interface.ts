import { CurrencyCode } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export interface GetUserWalletBalanceData {
  forex_exchange_rates_expires_at: string;
  forex_exchange_rates_id: string;
  balances: Record<CurrencyCode, Decimal>;
}
