import { Global, Module } from '@nestjs/common';
import { PrismaService, PrismaRepository } from './prisma.service';
import { UserRepository } from '../repositories/user/user.repository';
import { UserService } from '../repositories/user/user.service';
import { ForexExchangeRatesRepository } from '../repositories/forex-exchange-rates/forex-exchange-rates.repository';
import { ForexExchangeRatesService } from '../repositories/forex-exchange-rates/forex-exchange-rates.service';
import { RedisModule } from '../redis/redis.module';
import { WalletRepository } from '../repositories/wallet/wallet.repository';
import { WalletService } from '../repositories/wallet/wallet.service';
import { RefreshTokenRepository } from '../repositories/refresh/refresh.repository';
import { RefreshTokenService } from '../repositories/refresh/refresh.service';

@Global()
@Module({
  imports: [RedisModule],
  controllers: [],
  providers: [
    PrismaRepository,
    PrismaService,
    UserRepository,
    UserService,
    ForexExchangeRatesRepository,
    ForexExchangeRatesService,
    WalletRepository,
    WalletService,
    RefreshTokenRepository,
    RefreshTokenService,
  ],
  get exports() {
    return this.providers;
  },
})
export class DatabaseModule {}
