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
import {
  ForexEventPattern,
  SyncForexExchangeRateEvent,
} from '@forexsystem/helpers/events';

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
    const forexEchangeRatesId = 'nanoid';
    const params: ForexExchangeRateUrlProps = {
      to_currency: 'INR',
      apiKey: this._configService.ALPHA_VANTAGE_API_KEYS,
    };

    const url = getForexExchangeRateUrl(params);

    const eventData: SyncForexExchangeRateEvent['data'] = {
      url,
      forexExchangeId: forexEchangeRatesId,
    };

    //  Added the url to the queue for processing currency exchange rate and saving to the db
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
