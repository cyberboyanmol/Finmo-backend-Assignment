import { CurrencyCode } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export interface GetUserWalletBalanceData {
  user_id: string;
  account_id: string;
  balances: Record<CurrencyCode, Decimal>;
}
