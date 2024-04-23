import { CurrencyCode } from '@prisma/client';

export interface CurrencyExchangeRateResponse {
  'Realtime Currency Exchange Rate': RealtimeCurrencyExchangeRate;
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
