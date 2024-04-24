import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import {
  CurrencyExchangeRate,
  CurrencyExchangeRateResponse,
  RealtimeCurrencyExchangeRate,
} from '@forexsystem/helpers/interfaces/currency-exchange-rate.interface';

@Injectable()
export class FetchForexExchangeRateService {
  private readonly logger = new Logger(FetchForexExchangeRateService.name);

  constructor(private readonly httpService: HttpService) {}

  async fetchForexConversionRate(): Promise<CurrencyExchangeRate> {
    const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=JPY&apikey=demo`;

    try {
      const response: AxiosResponse<CurrencyExchangeRateResponse> =
        await this.httpService.axiosRef.get(url);
      const realtimeCurrencyExchangeRate: RealtimeCurrencyExchangeRate =
        response.data['Realtime Currency Exchange Rate'];

      const currencyExchangeRate: CurrencyExchangeRate = {
        from_currency_code:
          realtimeCurrencyExchangeRate['1. From_Currency Code'],
        from_currency_name:
          realtimeCurrencyExchangeRate['2. From_Currency Name'],
        to_currency_code: realtimeCurrencyExchangeRate['3. To_Currency Code'],
        to_currency_name: realtimeCurrencyExchangeRate['4. To_Currency Name'],
        exchange_rate: parseFloat(
          realtimeCurrencyExchangeRate['5. Exchange Rate']
        ),
        last_refreshed_at: realtimeCurrencyExchangeRate['6. Last Refreshed'],
        time_zone: realtimeCurrencyExchangeRate['7. Time Zone'],
        bid_price: parseFloat(realtimeCurrencyExchangeRate['8. Bid Price']),
        ask_price: parseFloat(realtimeCurrencyExchangeRate['9. Ask Price']),
      };

      return currencyExchangeRate;
    } catch (error) {
      this.logger.error('Error fetching forex conversion rate:', error);
      throw error;
    }
  }
}
