import { CurrencyCode } from '@prisma/client';

export interface CurrencyExchangeRateResponse {
  'Realtime Currency Exchange Rate': RealtimeCurrencyExchangeRate;
}

export interface CurrencyExchangeRate {
  from_currency_code: CurrencyCode;
  from_currency_name: string;
  to_currency_code: CurrencyCode;
  to_currency_name: string;
  exchange_rate: number;
  last_refreshed_at: string;
  time_zone: string;
  bid_price: number;
  ask_price: number;
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
