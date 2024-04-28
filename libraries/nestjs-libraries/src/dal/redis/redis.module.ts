import { Module } from '@nestjs/common';
import { RedisModule as IRedisModule } from '@nestjs-modules/ioredis';
import { RedisRepository } from './redis.repository';
import { RedisService } from './redis.service';
@Module({
  imports: [
    IRedisModule.forRoot({
      type: 'single',
      url: process.env.REDIS_URL!,
    }),
  ],
  controllers: [],
  providers: [RedisRepository, RedisService],
  exports: [RedisRepository, RedisService],
})
export class RedisModule {}
