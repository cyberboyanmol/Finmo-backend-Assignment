import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SyncForexExchangeRateService } from './tasks/sync-forex-exchange-rates.task';
import { BullMqModule } from '@forexsystem/nestjs-libraries/bull-mq-transport/bull-mq.module';
import { ConfigModule } from '@forexsystem/nestjs-libraries/config/config.module';
import { ioRedisClient } from '@forexsystem/nestjs-libraries/redis/redis.service';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule,
    BullMqModule.forRoot({
      connection: ioRedisClient,
      removeOnComplete: {
        age: 60 * 60,
      },
    }),
  ],
  controllers: [],
  providers: [SyncForexExchangeRateService],
})
export class CronModule {}
