import { Module } from '@nestjs/common';
import { RedisModule } from '@forexsystem/nestjs-libraries/dal/redis/redis.module';
import { ForexController } from './forex.controller';
import { ForexService } from './forex.service';

@Module({
  imports: [RedisModule],
  controllers: [ForexController],
  providers: [ForexService],
})
export class ForexModule {}
