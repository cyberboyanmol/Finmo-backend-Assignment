import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../prisma/prisma.service';

import { RealtimeCurrencyExchangeRate } from '@forexsystem/helpers/interfaces';
@Injectable()
export class ForexExchangeRatesRepository {
  constructor(
    private _forexExchangeRates: PrismaRepository<'forexExchangeRates'>,
    private _currencyExchangeRate: PrismaRepository<'currencyExchangeRate'>
  ) {}

  async createForexExchangeRates(data: {
    forex_exchange_rates_id: string;
    forex_exchange_rates_expires_at: string;
  }) {
    return this._forexExchangeRates.model.forexExchangeRates.create({
      data: {
        forex_exchange_rates_id: data.forex_exchange_rates_id,
        forex_exchange_rates_expires_at: data.forex_exchange_rates_expires_at,
      },
    });
  }

  async createCurrencyExchangeRate(
    data: RealtimeCurrencyExchangeRate & { forex_exchange_rates_id: string }
  ) {
    return this._currencyExchangeRate.model.currencyExchangeRate.create({
      data: {
        from_currency_code: data['1. From_Currency Code'],
        from_currency_name: data['2. From_Currency Name'],
        to_currency_code: data['3. To_Currency Code'],
        to_currency_name: data['4. To_Currency Name'],
        exchange_rate: data['5. Exchange Rate'],
        last_refreshed_at: data['6. Last Refreshed'],
        time_zone: data['7. Time Zone'],
        bid_price: data['8. Bid Price'],
        ask_price: data['9. Ask Price'],
        forex_exchange_rate: {
          connect: {
            forex_exchange_rates_id: data.forex_exchange_rates_id,
          },
        },
      },
    });
  }

  async getForexExchangeRatesById(data: { forex_exchange_rates_id: string }) {
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
