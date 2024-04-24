import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { Processor } from '@nestjs/bullmq';
import { FOREX_EXCHANGE_RATES } from '@forexsystem/nestjs-libraries/bull-mq-queue/queues';
import {
  ForexJobPattern,
  SyncForexExchangeRateJob,
} from '@forexsystem/helpers/jobs';
import { OnWorkerEvent, WorkerHost } from '@nestjs/bullmq';
import { FetchForexExchangeRateService } from '../services/fetch-forex-exchange-rate.service';
import { SaveForexExchangeRateToDatabaseService } from '../services/save-forex-exchange-rate-to-database.service';
import { SaveForexExchangeRateToRedisService } from '../services/save-forex-exchange-rate-to-redis.service';
import { RealtimeCurrencyExchangeRate } from '@forexsystem/helpers/interfaces';

@Processor(FOREX_EXCHANGE_RATES, { concurrency: 100, useWorkerThreads: true })
@Injectable()
export class SyncForexExchangeRateProcessor extends WorkerHost {
  private readonly logger = new Logger(SyncForexExchangeRateProcessor.name);
  constructor(
    private readonly _fetchForexExchangeRateService: FetchForexExchangeRateService,
    private readonly _saveForexExchangeRateToDatabaseService: SaveForexExchangeRateToDatabaseService,
    private readonly _saveForexExchangeRateToRedisService: SaveForexExchangeRateToRedisService
  ) {
    super();
  }

  async process(
    job: Job<SyncForexExchangeRateJob['data'], number, string>
  ): Promise<void> {
    try {
      switch (job.name) {
        case ForexJobPattern.SYNC_FOREX_EXCHANGE_RATES:
          await this.syncForexExchangeRates(job);
          break;
        default:
          break;
      }
    } catch (error) {
      this.logger.error(
        `Failed to process job ${job.id}: ${error.message}`,
        error.stack
      );
      throw error; // Throwing the error will cause the job to be re-queued for retry
    }
  }

  async syncForexExchangeRates(job: Job<SyncForexExchangeRateJob['data']>) {
    const forexExchangeRate =
      await this._fetchForexExchangeRateService.fetchForexConversionRate();

    const data = {
      ...forexExchangeRate,
      forex_exchange_rates_expires_at: job.data.forex_exchange_rates_expires_at,
      forex_exchange_rates_id: job.data.forex_exchange_rates_id,
    } as RealtimeCurrencyExchangeRate & {
      forex_exchange_rates_id: string;
      forex_exchange_rates_expires_at: string;
    };

    const updated_forex_exchange_rates =
      await this._saveForexExchangeRateToDatabaseService.saveForexExchangeRateToDatabase(
        data
      );
    console.log(updated_forex_exchange_rates);
    this.logger.log(
      `Successfully saved forex exchange rates in database with forex_exchange_rates_id: ${job.data.forex_exchange_rates_id}, jobid: ${job.id}`
    );
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    const { id, name, queueName, finishedOn, returnvalue } = job;
    const completionTime = finishedOn ? new Date(finishedOn).toISOString() : '';

    this.logger.log(
      `Job id: ${id}, name: ${name} completed in queue ${queueName} on ${completionTime}. Result: ${returnvalue}`
    );
  }

  @OnWorkerEvent('progress')
  onProgress(job: Job) {
    const { id, name, progress } = job;
    this.logger.log(`Job id: ${id}, name: ${name} completes ${progress}%`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    const { id, name, queueName, failedReason } = job;
    this.logger.error(
      `Job id: ${id}, name: ${name} failed in queue ${queueName}. Failed reason: ${failedReason}`
    );
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    const { id, name, queueName, timestamp } = job;
    const startTime = timestamp ? new Date(timestamp).toISOString() : '';
    this.logger.log(
      `Job id: ${id}, name: ${name} starts in queue ${queueName} on ${startTime}.`
    );
  }
}
