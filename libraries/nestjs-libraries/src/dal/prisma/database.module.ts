import { Global, Module } from '@nestjs/common';
import { PrismaService, PrismaRepository } from './prisma.service';
import { UserRepository } from '../repositories/user/user.repository';
import { UserService } from '../repositories/user/user.service';
import { ForexExchangeRatesRepository } from '../repositories/forex-exchange-rates/forex-exchange-rates.repository';
import { ForexExchangeRatesService } from '../repositories/forex-exchange-rates/forex-exchange-rates.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [
    PrismaRepository,
    PrismaService,
    UserRepository,
    UserService,
    ForexExchangeRatesRepository,
    ForexExchangeRatesService,
  ],
  get exports() {
    return this.providers;
  },
})
export class DatabaseModule {}
