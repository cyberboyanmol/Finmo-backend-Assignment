import { Injectable } from '@nestjs/common';
import { ForexExchangeRatesRepository } from './forex-exchange-rates.repository';
import {
  ForexExchangeRatesData,
  RealtimeCurrencyExchangeRate,
} from '@forexsystem/helpers/interfaces';

@Injectable()
export class ForexExchangeRatesService {
  constructor(
    private _forexExchangeRatesRepository: ForexExchangeRatesRepository
  ) {}

  async createForexExchangeRates(
    data: Pick<
      ForexExchangeRatesData,
      'forex_exchange_rates_id' | 'forex_exchange_rates_expires_at'
    >
  ) {
    return this._forexExchangeRatesRepository.createForexExchangeRates(data);
  }

  async createCurrencyExchangeRate(data: ForexExchangeRatesData) {
    return this._forexExchangeRatesRepository.createCurrencyExchangeRate(data);
  }

  async getForexExchangeRatesById(
    data: Pick<ForexExchangeRatesData, 'forex_exchange_rates_id'>
  ) {
    return this._forexExchangeRatesRepository.getForexExchangeRatesById(data);
  }

  async getLatestForexExchangeRates() {
    return this._forexExchangeRatesRepository.getForexExchangeRatesByUpdatedAt();
  }
}
