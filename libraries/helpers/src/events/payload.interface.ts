import { ForexEventPattern } from './patterns';

export interface SyncForexExchangeRateEvent {
  pattern: ForexEventPattern.SYNC_FOREX_EXCHANGE_RATES;
  data: {
    url: string;
    forexExchangeId: string;
  };
}
