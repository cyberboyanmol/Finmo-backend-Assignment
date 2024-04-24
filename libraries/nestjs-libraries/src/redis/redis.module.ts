import { Module } from '@nestjs/common';
import { RedisModule as IRedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    IRedisModule.forRoot({
      type: 'single',
      url: process.env.REDIS_URL!,
      // url: `rediss://${process.env['REDIS_HOST']!}:${process.env[
      //   'REDIS_PORT'
      // ]!}`,
    }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class RedisModule {}
