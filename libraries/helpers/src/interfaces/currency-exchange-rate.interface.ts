import {
  CurrencyCode,
  ForexExchangeRates,
  CurrencyExchangeRate as PrimaCurrencyExchangeRate,
} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export interface CurrencyExchangeRateResponse {
  'Realtime Currency Exchange Rate': RealtimeCurrencyExchangeRate;
}

export const BASE_CURRENCY = 'USD';

export interface CurrencyExchangeRate {
  from_currency_code: CurrencyCode;
  from_currency_name: string;
  to_currency_code: CurrencyCode;
  to_currency_name: string;
  exchange_rate: Decimal;
  last_refreshed_at: string;
  time_zone: string;
  bid_price: Decimal;
  ask_price: Decimal;
}

export interface RealtimeCurrencyExchangeRate {
  '1. From_Currency Code': CurrencyCode;
  '2. From_Currency Name': string;
  '3. To_Currency Code': CurrencyCode;
  '4. To_Currency Name': string;
  '5. Exchange Rate': string;
  '6. Last Refreshed': string;
  '7. Time Zone': string;
  '8. Bid Price': string;
  '9. Ask Price': string;
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface ForexExchangeRatesData {
  forex_exchange_rates_id: string;
  forex_exchange_rates_expires_at: string;
  currency_exchange_rates: CurrencyExchangeRate;
}
export interface ForexExchangeRatesRedisData {
  forex_exchange_rates_id: string;
  forex_exchange_rates_expires_at: string;
  currency_exchange_rates: CurrencyExchangeRate[];
}

export type ForexExchangeRatesDbData = ForexExchangeRates & {
  currency_exchange_rates: PrimaCurrencyExchangeRate[];
};
