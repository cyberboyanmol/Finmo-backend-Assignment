import { Injectable, Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
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
import { ForexExchangeRatesData } from '@forexsystem/helpers/interfaces';
import { InjectForexExchangeRatesQueue } from '@forexsystem/nestjs-libraries/bull-mq-queue/decorators/inject-queue.decorator';

@Processor(FOREX_EXCHANGE_RATES, { concurrency: 50, useWorkerThreads: true })
@Injectable()
export class SyncForexExchangeRateProcessor extends WorkerHost {
  private readonly logger = new Logger(SyncForexExchangeRateProcessor.name);
  constructor(
    @InjectForexExchangeRatesQueue() private _forexExchangeRatesQueue: Queue,
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
    // fetching the live conversion rates from alphavantage.co
    const forexExchangeRate =
      await this._fetchForexExchangeRateService.fetchForexConversionRate();

    const data: ForexExchangeRatesData = {
      forex_exchange_rates_id: job.data.forex_exchange_rates_id,
      forex_exchange_rates_expires_at: job.data.forex_exchange_rates_expires_at,
      currency_exchange_rates: forexExchangeRate,
    };

    // saving the conversion rates into the postgres database (for future reference)
    const updated_forex_exchange_rates =
      await this._saveForexExchangeRateToDatabaseService.saveForexExchangeRateToDatabase(
        data
      );

    // saving the conversion rates into the InMemory (i.e redis database)
    await this._saveForexExchangeRateToRedisService.saveForexExchangeRateToRedis(
      data
    );
    console.log(updated_forex_exchange_rates);
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: Job) {
    const { id, name, queueName, finishedOn, returnvalue } = job;
    const completionTime = finishedOn ? new Date(finishedOn).toISOString() : '';

    this.logger.log(
      `Job id: ${id}, name: ${name} completed in queue ${queueName} on ${completionTime}. Result: ${returnvalue}`
    );

    const activeJobsCount =
      await this._forexExchangeRatesQueue.getActiveCount();
    const waitingJobsCount =
      await this._forexExchangeRatesQueue.getWaitingCount();
    if (activeJobsCount === 0 && waitingJobsCount === 0) {
      // ✅ TODO:
      //  Impelement on redis key changing from FOREX_EXCHANGE_RATES:${RANDOM_STRING (i.e uuid)} to FOREX_EXCHANGE_RATES:LASTEST key
      console.log(
        'All jobs have been completed, executing afterAllJobsCompleted logic'
      );
    }
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
