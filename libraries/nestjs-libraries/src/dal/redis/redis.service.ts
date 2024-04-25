import { Inject, Injectable } from '@nestjs/common';
import { RedisRepository } from './redis.repository';
import { RedisPrefixEnum } from './enum/redis-prefix.enum';
import { ForexExchangeRatesRedisData } from '@forexsystem/helpers/interfaces';

@Injectable()
export class RedisService {
  constructor(private readonly _redisRepository: RedisRepository) {}

  async setForexExchangeRateWithExpiry(
    key: string,
    data: ForexExchangeRatesRedisData,
    expiry_ttl: number
  ) {
    return await this._redisRepository.setWithExpiry(
      RedisPrefixEnum.FOREX_EXCHANGE_RATES,
      key,
      JSON.stringify(data),
      expiry_ttl
    );
  }

  async getForexExchangeRate(
    key: string
  ): Promise<ForexExchangeRatesRedisData | null> {
    const forexExchangeRatesData = await this._redisRepository.get(
      RedisPrefixEnum.FOREX_EXCHANGE_RATES,
      key
    );
    if (!forexExchangeRatesData) {
      return null;
    }
    return JSON.parse(forexExchangeRatesData);
  }

  async deleteForexExchangeRateById(key: string) {
    return await this._redisRepository.delete(
      RedisPrefixEnum.FOREX_EXCHANGE_RATES,
      key
    );
  }
}
