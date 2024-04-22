import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';

import {
  CurrencyCode,
  currencyCodesWithName,
} from '@forexsystem/helpers/utils';
import { buildForexExchangeRateUrl } from '../helpers/url-builder';
import { ConfigService } from '@forexsystem/nestjs-libraries/config/config.service';
import { buildForexExchangeRateUrlProps } from '../types';

@Injectable()
export class ForexSyncService {
  constructor(private readonly configService: ConfigService) {}
  @Cron(CronExpression.EVERY_MINUTE)
  async syncForexRates() {
    const forexEchangeRatesId = 'nanoid';

    currencyCodesWithName.map(async (currency: CurrencyCode) => {
      const params: buildForexExchangeRateUrlProps = {
        to_currency: currency.code,
        apiKey: this.configService.ALPHA_VANTAGE_API_KEYS,
      };
      const url = buildForexExchangeRateUrl(params);
      console.log(url, forexEchangeRatesId);
      // ✅ TODO
      //  Added the url to the queue for processing currency exchange rate and saving to the db
    });
  }
}
