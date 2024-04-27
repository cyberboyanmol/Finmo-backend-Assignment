import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RedisModule } from '@forexsystem/nestjs-libraries/dal/redis/redis.module';
import { UserWalletService } from './user-wallet.service';
import { UserWalletController } from './user-wallet.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

@Module({
  imports: [RedisModule],
  controllers: [UserWalletController],
  providers: [UserWalletService],
})
export class UserWalletModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(UserWalletController);
  }
}
