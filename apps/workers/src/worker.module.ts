import { Module } from '@nestjs/common';

import { ForexExchangeRateController } from './forex-exchange-rate.controller';

import { BullMqModule } from '@forexsystem/nestjs-libraries/bull-mq-transport//bull-mq.module';
import { DatabaseModule } from '@forexsystem/nestjs-libraries/dal/prisma/database.module';
import { ioRedisClient } from '@forexsystem/nestjs-libraries/redis/redis.service';

@Module({
  imports: [
    DatabaseModule,
    BullMqModule.forRoot({
      connection: ioRedisClient,
    }),
  ],
  controllers: [ForexExchangeRateController],
  providers: [],
})
export class WorkerModule {}
