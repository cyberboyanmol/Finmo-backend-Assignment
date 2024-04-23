import { Controller, Get, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, Transport } from '@nestjs/microservices';
import {
  ForexEventPattern,
  SyncForexExchangeRateEvent,
} from '@forexsystem/helpers/events';
import { Job } from 'bullmq';
import { FetchForexExchangeRateService } from './services/fetch-forex-exchange-rate.service';
import { SaveForexExchangeRateToDatabaseService } from './services/save-forex-exchange-rate-to-database.service';
import { SaveForexExchangeRateToRedisService } from './services/save-forex-exchange-rate-to-redis.service';
import { RealtimeCurrencyExchangeRate } from '@forexsystem/helpers/interfaces';

@Controller()
export class SyncForexExchangeRateController {
  private readonly logger = new Logger(SyncForexExchangeRateController.name);
  constructor(
    private readonly _fetchForexExchangeRateService: FetchForexExchangeRateService,
    private readonly _saveForexExchangeRateToDatabaseService: SaveForexExchangeRateToDatabaseService,
    private readonly _saveForexExchangeRateToRedisService: SaveForexExchangeRateToRedisService
  ) {}
  @EventPattern(ForexEventPattern.SYNC_FOREX_EXCHANGE_RATES, Transport.REDIS, {
    concurrency: 1,
  })
  async syncForexExchangeRates(
    @Payload() payload: SyncForexExchangeRateEvent['data'],
    @Ctx() job: Job
  ) {
    this.logger.log(
      `Saving.. forex exchange rates in database with forex_exchange_rates_id: ${payload.forex_exchange_rates_id}, jobid: ${job.id}`
    );
    const forexExchangeRate =
      await this._fetchForexExchangeRateService.fetchForexConversionRate();

    const data = {
      ...forexExchangeRate,
      forex_exchange_rates_expires_at: payload.forex_exchange_rates_expires_at,
      forex_exchange_rates_id: payload.forex_exchange_rates_id,
    } as RealtimeCurrencyExchangeRate & {
      forex_exchange_rates_id: string;
      forex_exchange_rates_expires_at: string;
    };

    const updated_forex_exchange_rates =
      await this._saveForexExchangeRateToDatabaseService.saveForexExchangeRateToDatabase(
        data
      );
    this.logger.log(
      `Successfully saved forex exchange rates in database with forex_exchange_rates_id: ${payload.forex_exchange_rates_id}, jobid: ${job.id}`
    );
    console.log(updated_forex_exchange_rates);
  }
}
