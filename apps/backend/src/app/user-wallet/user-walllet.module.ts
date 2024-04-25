import { Module } from '@nestjs/common';
import { RedisModule } from '@forexsystem/nestjs-libraries/dal/redis/redis.module';
import { UserWalletService } from './user-wallet.service';
import { UserWalletController } from './user-wallet.controller';

@Module({
  imports: [RedisModule],
  controllers: [UserWalletController],
  providers: [UserWalletService],
})
export class UserWalletModule {}
