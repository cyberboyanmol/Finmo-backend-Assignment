import { InjectQueue } from '@nestjs/bullmq';
import { FOREX_EXCHANGE_RATES } from '../queues';

export const InjectForexExchangeRatesQueue = () =>
  InjectQueue(FOREX_EXCHANGE_RATES);
