import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '@forexsystem/nestjs-libraries/redis/redis.service';
import { CurrencyExchangeRate } from '@prisma/client';
import {
  ForexExchangeRatesData,
  ForexExchangeRatesRedisData,
} from '@forexsystem/helpers/interfaces';
const FOREX_EXCHANGE_RATES_TTL = 1000 * 30;

@Injectable()
export class SaveForexExchangeRateToRedisService {
  private readonly logger = new Logger(
    SaveForexExchangeRateToRedisService.name
  );
  constructor(private readonly _redisSerivce: RedisService) {}

  async saveForexExchangeRateToRedis(data: ForexExchangeRatesData) {
    // check if the forex exchange rates exists or not
    try {
      const forexExchangeRateRedis: ForexExchangeRatesRedisData = {
        forex_exchange_rates_id: data.forex_exchange_rates_id,
        forex_exchange_rates_expires_at: data.forex_exchange_rates_expires_at,
        currency_exchange_rates: [data.currency_exchange_rates],
      };
      const forex_exchange_rates =
        (await this._redisSerivce.getForexExchangeRateFromRedis(
          data.forex_exchange_rates_id
        )) as ForexExchangeRatesRedisData | null;

      if (!forex_exchange_rates) {
        await this._redisSerivce.setForexExchangeRateToRedis(
          data.forex_exchange_rates_id,
          forexExchangeRateRedis,
          FOREX_EXCHANGE_RATES_TTL
        );
      } else {
        // copying the previous currency exchange rates
        const copyCurrencyExchangeRate =
          forex_exchange_rates.currency_exchange_rates;

        const forexExchangeRateRedis: ForexExchangeRatesRedisData = {
          forex_exchange_rates_id: data.forex_exchange_rates_id,
          forex_exchange_rates_expires_at: data.forex_exchange_rates_expires_at,
          currency_exchange_rates: [
            ...copyCurrencyExchangeRate,
            data.currency_exchange_rates,
          ],
        };


        
      }
    } catch (e) {
      this.logger.error('Error in saving forex exchange rates in db:', e);
      throw e;
    }
  }
}
