import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CryptoService } from '@forexsystem/helpers/auth/crypto.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, CryptoService],
})
export class AuthModule {}
