import { Controller, Get } from '@nestjs/common';
import { Ctx, EventPattern, Payload, Transport } from '@nestjs/microservices';
import {
  ForexEventPattern,
  SyncForexExchangeRateEvent,
} from '@forexsystem/helpers/events';
import { Job } from 'bullmq';
@Controller()
export class SyncForexExchangeRateController {
  constructor() {}
  @EventPattern(ForexEventPattern.SYNC_FOREX_EXCHANGE_RATES, Transport.REDIS, {
    concurrency: 1,
  })
  async syncForexExchangeRates(
    @Payload() data: SyncForexExchangeRateEvent['data'],
    @Ctx() job: Job
  ) {
    console.log(data);
    console.log(job.id);
  }
}
