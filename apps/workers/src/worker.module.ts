import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BullModule as BullMqModule } from '@nestjs/bullmq';
import { DatabaseModule } from '@forexsystem/nestjs-libraries/dal/prisma/database.module';
import { RedisModule } from '@forexsystem/nestjs-libraries/dal/redis/redis.module';
import { FetchForexExchangeRateService } from './services/fetch-forex-exchange-rate.service';
import { SaveForexExchangeRateToDatabaseService } from './services/save-forex-exchange-rate-to-database.service';
import { SaveForexExchangeRateToRedisService } from './services/save-forex-exchange-rate-to-redis.service';
import { SyncForexExchangeRateProcessor } from './processors/sync-forex-exchange-rate.processor';
import { FOREX_EXCHANGE_RATES } from '@forexsystem/nestjs-libraries/bull-mq-queue/queues';
import { QueueModule } from '@forexsystem/nestjs-libraries/bull-mq-queue/bull-mq-queue.module';

@Module({
  imports: [
    DatabaseModule,
    RedisModule,
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
    BullMqModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        username: process.env.REDIS_USER,
        password: process.env.REDIS_PASS,
      },

      defaultJobOptions: {
        removeOnComplete: { age: 200, count: 50 },
        removeOnFail: { age: 200, count: 200 },
        attempts: 3,
      },
    }),
    QueueModule.register({
      queues: [FOREX_EXCHANGE_RATES],
    }),
  ],

  controllers: [],
  providers: [
    SyncForexExchangeRateProcessor,
    FetchForexExchangeRateService,
    SaveForexExchangeRateToDatabaseService,
    SaveForexExchangeRateToRedisService,
  ],
})
export class WorkerModule {}
