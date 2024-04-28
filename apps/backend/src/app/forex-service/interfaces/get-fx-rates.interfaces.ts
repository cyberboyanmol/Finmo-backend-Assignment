import { CurrencyExchangeRate } from '@forexsystem/helpers/interfaces';

export interface GetFxRatesInterface {
  forex_exchange_rates_id: string;
  forex_exchange_rates_expires_at: string;
  currency_exchange_rates: Pick<
    CurrencyExchangeRate,
    | 'from_currency_code'
    | 'from_currency_name'
    | 'exchange_rate'
    | 'to_currency_code'
    | 'from_currency_name'
  >[];
}
