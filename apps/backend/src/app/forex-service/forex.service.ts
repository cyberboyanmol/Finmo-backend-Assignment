import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@forexsystem/nestjs-libraries/config/config.service';
import { WalletService } from '@forexsystem/nestjs-libraries/dal/repositories/wallet/wallet.service';
import { TopupAccountDto } from '@forexsystem/nestjs-libraries/dtos/user-wallet/topup-account.dto';
import { RedisService } from '@forexsystem/nestjs-libraries/dal/redis/redis.service';
import {
  BASE_CURRENCY,
  ForexExchangeRatesData,
  ForexExchangeRatesRedisData,
} from '@forexsystem/helpers/interfaces';
import { CurrencyConverterService } from '@forexsystem/helpers/currency-converter/currency-converter.service';
import { ForexExchangeRatesLastestRedisKey } from '@forexsystem/helpers/utils/constants';
import { CurrencyCode } from '@prisma/client';
import { FxConversionDto } from '@forexsystem/nestjs-libraries/dtos/forex/fx-conversion.dto';

@Injectable()
export class ForexService {
  private readonly logger = new Logger(ForexService.name);
  constructor(private readonly _redisSerivce: RedisService) {}
  async getLastestFxRates(): Promise<ForexExchangeRatesRedisData | null> {
    const forex_exchange_rates = await this._redisSerivce.getForexExchangeRate(
      ForexExchangeRatesLastestRedisKey
    );

    if (
      forex_exchange_rates &&
      forex_exchange_rates.currency_exchange_rates.length
    ) {
      return forex_exchange_rates;
    } else {
      // fetch the lastest fx rates from the database
      //   return null;
    }
    return null;
  }
}
