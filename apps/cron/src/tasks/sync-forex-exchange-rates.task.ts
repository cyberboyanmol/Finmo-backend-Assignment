import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
// import axios from 'axios';

// import {
//   CurrencyCode,
//   currencyCodesWithName,
// } from '@forexsystem/helpers/utils';
import { getForexExchangeRateUrl } from '../helpers/url-builder';
import { ConfigService } from '@forexsystem/nestjs-libraries/config/config.service';
import { ForexExchangeRateUrlProps } from '../types';
import { BullMqClient } from '@forexsystem/nestjs-libraries/bull-mq-transport/client';
import { v4 as uuidV4 } from 'uuid';
import {
  ForexEventPattern,
  SyncForexExchangeRateEvent,
} from '@forexsystem/helpers/events';
import { generateTimestamp } from '@forexsystem/helpers/utils';

@Injectable()
export class SyncForexExchangeRateService {
  constructor(
    private readonly _configService: ConfigService,
    private _workerServiceProducer: BullMqClient
  ) {}

  // @Cron(CronExpression.EVERY_HOUR)
  @Cron('*/30 * * * * *')
  async syncForexExchangeRatesEveryHour() {
    // THIS CRON WILL ONLY ADD THE USD TO INR FETCHING URL
    // DUE TO ALPHA VANTAGE API HARD RATE LIMIT (i.e 25 requests a day only)

    const forex_exchange_rates_expires_at_milliseconds = 1000 * 30;
    const forex_exchange_rates_id = uuidV4();
    const forex_exchange_rates_expires_at = generateTimestamp(
      forex_exchange_rates_expires_at_milliseconds
    );
    const params: ForexExchangeRateUrlProps = {
      to_currency: 'INR',
      apiKey: this._configService.ALPHA_VANTAGE_API_KEYS,
    };

    const url = getForexExchangeRateUrl(params);

    const eventData: SyncForexExchangeRateEvent['data'] = {
      url,
      forex_exchange_rates_id,
      forex_exchange_rates_expires_at,
    };

    this._workerServiceProducer.emit(
      ForexEventPattern.SYNC_FOREX_EXCHANGE_RATES,
      { payload: { ...eventData } }
    );
  }

  // @Cron('*/30 * * * * *')
  // async syncForexRatesEvery30Seconds() {
  //   const forexEchangeRatesId = 'nanoid';
  //   currencyCodesWithName.map(async (currency: CurrencyCode) => {
  //     const params: buildForexExchangeRateUrlProps = {
  //       to_currency: currency.code,
  //       apiKey: this._configService.ALPHA_VANTAGE_API_KEYS,
  //     };
  //     const url = buildForexExchangeRateUrl(params);
  //     console.log(url, forexEchangeRatesId);
  //     // ✅ TODO
  //     //  Added the url to the queue for processing currency exchange rate and saving to the db
  //   });
  // }

  // @Cron(CronExpression.EVERY_HOUR)
  // async syncForexRatesEveryHour() {
  //   const forexEchangeRatesId = 'nanoid';
  //   currencyCodesWithName.map(async (currency: CurrencyCode) => {
  //     const params: buildForexExchangeRateUrlProps = {
  //       to_currency: currency.code,
  //       apiKey: this._configService.ALPHA_VANTAGE_API_KEYS,
  //     };
  //     const url = buildForexExchangeRateUrl(params);
  //     console.log(url, forexEchangeRatesId);
  //     // ✅ TODO
  //     //  Added the url to the queue for processing currency exchange rate and saving to the db
  //   });
  // }
}
