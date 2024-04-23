// import { Injectable, Logger } from '@nestjs/common';
// import { HttpService } from '@nestjs/axios';
// import { AxiosResponse } from 'axios';
// import {
//   CurrencyExchangeRateResponse,
//   RealtimeCurrencyExchangeRate,
// } from '@forexsystem/helpers/interfaces/currency-exchange-rate.interface';
// import { catchError, map, Observable } from 'rxjs';

// @Injectable()
// export class FetchForexExchangeRateService {
//   private readonly logger = new Logger(FetchForexExchangeRateService.name);

//   constructor(private readonly httpService: HttpService) {}

//   fetchForexConversionRate(): Observable<RealtimeCurrencyExchangeRate> {
//     const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=JPY&apikey=demo`;

//     return this.httpService.get<CurrencyExchangeRateResponse>(url).pipe(
//       map((response) => response.data['Realtime Currency Exchange Rate']),
//       catchError((error) => {
//         this.logger.error('Error fetching forex conversion rate:', error);
//         throw error;
//       })
//     );
//   }
// }

import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import {
  CurrencyExchangeRateResponse,
  RealtimeCurrencyExchangeRate,
} from '@forexsystem/helpers/interfaces/currency-exchange-rate.interface';

@Injectable()
export class FetchForexExchangeRateService {
  private readonly logger = new Logger(FetchForexExchangeRateService.name);

  constructor(private readonly httpService: HttpService) {}

  async fetchForexConversionRate(): Promise<RealtimeCurrencyExchangeRate> {
    const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=JPY&apikey=demo`;

    try {
      const response: AxiosResponse<CurrencyExchangeRateResponse> =
        await this.httpService.axiosRef.get(url);
      const exchangeRate: RealtimeCurrencyExchangeRate =
        response.data['Realtime Currency Exchange Rate'];
      return exchangeRate;
    } catch (error) {
      this.logger.error('Error fetching forex conversion rate:', error);
      throw error;
    }
  }
}
