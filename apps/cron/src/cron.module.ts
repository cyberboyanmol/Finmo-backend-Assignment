import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SyncForexExchangeRateService } from './tasks/sync-forex-exchange-rates.task';
import { BullModule as BullMqModule } from '@nestjs/bullmq';
import { ConfigModule } from '@forexsystem/nestjs-libraries/config/config.module';
import { QueueModule } from '@forexsystem/nestjs-libraries/bull-mq-queue/bull-mq-queue.module';
import { FOREX_EXCHANGE_RATES } from '@forexsystem/nestjs-libraries/bull-mq-queue/queues';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule,
    BullMqModule.forRoot({
      defaultJobOptions: {
        removeOnComplete: { age: 200, count: 50 },
        removeOnFail: { age: 200, count: 200 },
        attempts: 3,
      },
      connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        username: process.env.REDIS_USER,
        password: process.env.REDIS_PASS,
      },
    }),

    QueueModule.register({
      queues: [FOREX_EXCHANGE_RATES],
    }),
  ],
  controllers: [],
  providers: [SyncForexExchangeRateService],
})
export class CronModule {}
