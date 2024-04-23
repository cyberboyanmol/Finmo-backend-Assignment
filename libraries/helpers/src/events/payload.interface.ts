import { ForexEventPattern } from './patterns';

export interface SyncForexExchangeRateEvent {
  pattern: ForexEventPattern.SYNC_FOREX_EXCHANGE_RATES;
  data: {
    url: string;
    forex_exchange_rates_id: string;
    forex_exchange_rates_expires_at: string;
  };
}
