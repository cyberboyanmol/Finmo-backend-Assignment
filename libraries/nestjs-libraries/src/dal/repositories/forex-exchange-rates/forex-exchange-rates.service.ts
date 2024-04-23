import { Injectable } from '@nestjs/common';
import { ForexExchangeRatesRepository } from './forex-exchange-rates.repository';
import { RealtimeCurrencyExchangeRate } from '@forexsystem/helpers/interfaces';

@Injectable()
export class ForexExchangeRatesService {
  constructor(
    private _forexExchangeRatesRepository: ForexExchangeRatesRepository
  ) {}

  async createForexExchangeRates(data: {
    forex_exchange_rates_id: string;
    forex_exchange_rates_expires_at: string;
  }) {
    return this._forexExchangeRatesRepository.createForexExchangeRates(data);
  }

  async createCurrencyExchangeRate(
    data: RealtimeCurrencyExchangeRate & { forex_exchange_rates_id: string }
  ) {
    return this._forexExchangeRatesRepository.createCurrencyExchangeRate(data);
  }

  async getForexExchangeRatesById(data: { forex_exchange_rates_id: string }) {
    return this._forexExchangeRatesRepository.getForexExchangeRatesById(data);
  }
}
