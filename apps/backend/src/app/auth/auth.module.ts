import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CryptoService } from '@forexsystem/helpers/auth/crypto.service';
import { RedisModule } from '@forexsystem/nestjs-libraries/dal/redis/redis.module';
@Module({
  imports: [RedisModule],
  controllers: [AuthController],
  providers: [AuthService, CryptoService],
})
export class AuthModule {}
