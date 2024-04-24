import { Injectable, Logger } from '@nestjs/common';
import { ForexExchangeRatesService } from '@forexsystem/nestjs-libraries/dal/repositories/forex-exchange-rates/forex-exchange-rates.service';
import { ForexExchangeRatesData } from '@forexsystem/helpers/interfaces';
@Injectable()
export class SaveForexExchangeRateToDatabaseService {
  private readonly logger = new Logger(
    SaveForexExchangeRateToDatabaseService.name
  );
  constructor(
    private readonly _forexExchangeRatesService: ForexExchangeRatesService
  ) {}

  async saveForexExchangeRateToDatabase(data: ForexExchangeRatesData) {
    // check if the forex exchange rates exists or not
    try {
      const forex_exchange_rates =
        await this._forexExchangeRatesService.getForexExchangeRatesById({
          forex_exchange_rates_id: data.forex_exchange_rates_id,
        });

      if (!forex_exchange_rates) {
        await this._forexExchangeRatesService.createForexExchangeRates({
          forex_exchange_rates_id: data.forex_exchange_rates_id,
          forex_exchange_rates_expires_at: data.forex_exchange_rates_expires_at,
        });
      }

      // save the currencyExchange rate to database
      const currencyExchangeRate =
        await this._forexExchangeRatesService.createCurrencyExchangeRate({
          ...data,
        });

      const updated_forex_exchange_rates =
        await this._forexExchangeRatesService.getForexExchangeRatesById({
          forex_exchange_rates_id: data.forex_exchange_rates_id,
        });

      return { updated_forex_exchange_rates, currencyExchangeRate };
    } catch (e) {
      this.logger.error('Error in saving forex exchange rates in db:', e);
      throw e;
    }
  }
}
