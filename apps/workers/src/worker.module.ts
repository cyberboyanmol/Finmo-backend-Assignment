import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SyncForexExchangeRateController } from './sync-forex-exchange-rate.controller';
import { BullMqModule } from '@forexsystem/nestjs-libraries/bull-mq-transport//bull-mq.module';
import { DatabaseModule } from '@forexsystem/nestjs-libraries/dal/prisma/database.module';
import { ioRedisClient } from '@forexsystem/nestjs-libraries/redis/redis.service';
import { FetchForexExchangeRateService } from './services/fetch-forex-exchange-rate.service';
import { SaveForexExchangeRateToDatabaseService } from './services/save-forex-exchange-rate-to-database.service';
import { SaveForexExchangeRateToRedisService } from './services/save-forex-exchange-rate-to-redis.service';

@Module({
  imports: [
    DatabaseModule,
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
    BullMqModule.forRoot({
      connection: ioRedisClient,
    }),
  ],
  controllers: [SyncForexExchangeRateController],
  providers: [
    FetchForexExchangeRateService,
    SaveForexExchangeRateToDatabaseService,
    SaveForexExchangeRateToRedisService,
  ],
})
export class WorkerModule {}
