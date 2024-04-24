import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../prisma/prisma.service';

import {
  ForexExchangeRatesData,
  RealtimeCurrencyExchangeRate,
} from '@forexsystem/helpers/interfaces';
@Injectable()
export class ForexExchangeRatesRepository {
  constructor(
    private _forexExchangeRates: PrismaRepository<'forexExchangeRates'>,
    private _currencyExchangeRate: PrismaRepository<'currencyExchangeRate'>
  ) {}

  async createForexExchangeRates(
    data: Pick<
      ForexExchangeRatesData,
      'forex_exchange_rates_expires_at' | 'forex_exchange_rates_id'
    >
  ) {
    return this._forexExchangeRates.model.forexExchangeRates.create({
      data: {
        forex_exchange_rates_id: data.forex_exchange_rates_id,
        forex_exchange_rates_expires_at: data.forex_exchange_rates_expires_at,
      },
    });
  }

  async createCurrencyExchangeRate(data: ForexExchangeRatesData) {
    return this._currencyExchangeRate.model.currencyExchangeRate.create({
      data: {
        from_currency_code: data.currency_exchange_rates.from_currency_code,
        from_currency_name: data.currency_exchange_rates.from_currency_name,
        to_currency_code: data.currency_exchange_rates.to_currency_code,
        to_currency_name: data.currency_exchange_rates.to_currency_name,
        exchange_rate: data.currency_exchange_rates.exchange_rate,
        last_refreshed_at: data.currency_exchange_rates.last_refreshed_at,
        time_zone: data.currency_exchange_rates.time_zone,
        bid_price: data.currency_exchange_rates.bid_price,
        ask_price: data.currency_exchange_rates.ask_price,
        forex_exchange_rate: {
          connect: {
            forex_exchange_rates_id: data.forex_exchange_rates_id,
          },
        },
      },
    });
  }

  async getForexExchangeRatesById(
    data: Pick<ForexExchangeRatesData, 'forex_exchange_rates_id'>
  ) {
    return this._forexExchangeRates.model.forexExchangeRates.findUnique({
      where: {
        forex_exchange_rates_id: data.forex_exchange_rates_id,
      },
    });
  }

  // async getForexExchangeRatesByExpiresAt(){
  //   return this._forexExchangeRates.model.forexExchangeRates.findFirst({
  //     where:{
  //       forex_exchange_rates_id
  //     }
  //   })
  // }
}
