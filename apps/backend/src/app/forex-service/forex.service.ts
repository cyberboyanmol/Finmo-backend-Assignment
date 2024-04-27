import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@forexsystem/nestjs-libraries/config/config.service';
import { WalletService } from '@forexsystem/nestjs-libraries/dal/repositories/wallet/wallet.service';
import { TopupAccountDto } from '@forexsystem/nestjs-libraries/dtos/user-wallet/topup-account.dto';
import { RedisService } from '@forexsystem/nestjs-libraries/dal/redis/redis.service';
import {
  BASE_CURRENCY,
  CurrencyExchangeRate,
  ForexExchangeRatesData,
  ForexExchangeRatesDbData,
  ForexExchangeRatesRedisData,
} from '@forexsystem/helpers/interfaces';
import { CurrencyConverterService } from '@forexsystem/helpers/currency-converter/currency-converter.service';
import { ForexExchangeRatesLastestRedisKey } from '@forexsystem/helpers/utils/constants';
import { CurrencyCode } from '@prisma/client';
import { FxConversionDto } from '@forexsystem/nestjs-libraries/dtos/forex/fx-conversion.dto';
import { ForexExchangeRatesService } from '@forexsystem/nestjs-libraries/dal/repositories/forex-exchange-rates/forex-exchange-rates.service';
import { CurrencyExchangeRate as PrimaCurrencyExchangeRate } from '@prisma/client';
import { GetFxRatesInterface } from './interfaces/get-fx-rates.interfaces';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class ForexService {
  private readonly logger = new Logger(ForexService.name);
  constructor(
    private readonly _redisService: RedisService,
    private readonly _forexExchangeRatesService: ForexExchangeRatesService
  ) {}

  async getLastestFxRates(): Promise<GetFxRatesInterface | null> {
    const redisData = await this._redisService.getForexExchangeRate(
      ForexExchangeRatesLastestRedisKey
    );
    const dbData =
      await this._forexExchangeRatesService.getLatestForexExchangeRates();

    if (redisData && redisData.currency_exchange_rates.length) {
      return this.formatRedisData(redisData);
    }

    if (dbData[0] && dbData[0].currency_exchange_rates.length) {
      return this.formatDbData(dbData[0]);
    }

    return null;
  }

  private formatRedisData(
    redisData: ForexExchangeRatesRedisData
  ): GetFxRatesInterface {
    const {
      forex_exchange_rates_id,
      forex_exchange_rates_expires_at,
      currency_exchange_rates,
    } = redisData;
    return {
      forex_exchange_rates_id,
      forex_exchange_rates_expires_at,
      currency_exchange_rates: currency_exchange_rates.map(
        this.mapCurrencyExchangeRate
      ),
    };
  }

  private formatDbData(dbData: ForexExchangeRatesDbData): GetFxRatesInterface {
    const {
      forex_exchange_rates_id,
      forex_exchange_rates_expires_at,
      currency_exchange_rates,
    } = dbData;
    return {
      forex_exchange_rates_id,
      forex_exchange_rates_expires_at:
        forex_exchange_rates_expires_at.toISOString(),
      currency_exchange_rates: currency_exchange_rates.map(
        this.mapCurrencyExchangeRate
      ),
    };
  }

  private mapCurrencyExchangeRate(
    currencyExchange: CurrencyExchangeRate | PrimaCurrencyExchangeRate
  ): Omit<
    CurrencyExchangeRate,
    'last_refreshed_at' | 'time_zone' | 'bid_price' | 'ask_price'
  > {
    const {
      from_currency_code,
      from_currency_name,
      to_currency_code,
      to_currency_name,
      exchange_rate,
    } = currencyExchange;
    return {
      from_currency_code,
      from_currency_name,
      to_currency_code,
      to_currency_name,
      exchange_rate,
    };
  }

  // async fxConversion(body: FxConversionDto) {
  //   const {
  //     forex_exchange_rates_id,
  //     from_currency_code,
  //     to_currency_code,
  //     amount,
  //   } = body;
  //   const redisData = await this._redisService.getForexExchangeRate(
  //     ForexExchangeRatesLastestRedisKey
  //   );
  //   const dbData = forex_exchange_rates_id
  //     ? await this._forexExchangeRatesService.getForexExchangeRatesById({
  //         forex_exchange_rates_id,
  //       })
  //     : (
  //         await this._forexExchangeRatesService.getLatestForexExchangeRates()
  //       )[0];

  //   const exchangeRates = this.getExchangeRates(
  //     redisData,
  //     dbData,
  //     from_currency_code,
  //     to_currency_code
  //   );

  //   if (!exchangeRates) {
  //     throw new Error('Exchange rates not found');
  //   }

  //   const { fromCurrencyExchangeRate, toCurrencyExchangeRate } = exchangeRates;
  //   const result = CurrencyConverterService.convert({
  //     fromCurrencyCode: from_currency_code,
  //     fromCurrencyExchangeRateFromBaseCurrency:
  //       fromCurrencyExchangeRate.exchange_rate,
  //     toCurrencyCode: to_currency_code,
  //     toCurrencyExchangeRateFromBaseCurrency:
  //       toCurrencyExchangeRate.exchange_rate,
  //     amount,
  //   });

  //   return {
  //     convertedAmount: result,
  //     currency: to_currency_code,
  //   };
  // }

  // private getExchangeRates(
  //   redisData: ForexExchangeRatesRedisData | null,
  //   dbData: ForexExchangeRatesDbData | null,
  //   fromCurrencyCode: CurrencyCode,
  //   toCurrencyCode: CurrencyCode
  // ): {
  //   fromCurrencyExchangeRate: CurrencyExchangeRate;
  //   toCurrencyExchangeRate: CurrencyExchangeRate;
  // } | null {
  //   const data =
  //     redisData?.currency_exchange_rates ||
  //     dbData?.currency_exchange_rates ||
  //     [];

  //   const fromCurrencyExchangeRate = data.find(
  //     (rate) => rate.to_currency_code === fromCurrencyCode
  //   );
  //   const toCurrencyExchangeRate = data.find(
  //     (rate) => rate.to_currency_code === toCurrencyCode
  //   );

  //   if (!fromCurrencyExchangeRate || !toCurrencyExchangeRate) {
  //     return null;
  //   }

  //   return { fromCurrencyExchangeRate, toCurrencyExchangeRate };
  // }

  //  THIS FUNCTION IS ONLY VALID FOR DEMO APIKEY OF ALPHAVANTAGE.CO
  async fxConversionFormBaseCurrency(body: FxConversionDto) {
    const { forex_exchange_rates_id, to_currency_code, amount } = body;

    const redisData = await this._redisService.getForexExchangeRate(
      ForexExchangeRatesLastestRedisKey
    );
    const dbData = forex_exchange_rates_id
      ? await this._forexExchangeRatesService.getForexExchangeRatesById({
          forex_exchange_rates_id,
        })
      : (
          await this._forexExchangeRatesService.getLatestForexExchangeRates()
        )[0];

    const exchangeRates = this.getExchangeRates(
      redisData,
      dbData,
      to_currency_code
    );

    if (!exchangeRates) {
      throw new Error('Exchange rates not found');
    }

    const { toCurrencyExchangeRate } = exchangeRates;
    const result = CurrencyConverterService.convert({
      fromCurrencyCode: BASE_CURRENCY,
      fromCurrencyExchangeRateFromBaseCurrency: new Decimal(1.0),
      toCurrencyCode: to_currency_code,
      toCurrencyExchangeRateFromBaseCurrency:
        toCurrencyExchangeRate.exchange_rate,
      amount,
    });

    return {
      convertedAmount: result,
      currency: to_currency_code,
    };
  }

  //  THIS FUNCTION IS ONLY VALID FOR DEMO APIKEY OF ALPHAVANTAGE.CO
  private getExchangeRates(
    redisData: ForexExchangeRatesRedisData | null,
    dbData: ForexExchangeRatesDbData | null,
    toCurrencyCode: CurrencyCode
  ): {
    toCurrencyExchangeRate: CurrencyExchangeRate;
  } | null {
    const data =
      redisData?.currency_exchange_rates ||
      dbData?.currency_exchange_rates ||
      [];

    console.log(data);
    const toCurrencyExchangeRate = data.find(
      (rate) => rate.to_currency_code === toCurrencyCode
    );

    if (!toCurrencyExchangeRate) {
      return null;
    }

    return { toCurrencyExchangeRate };
  }
}
