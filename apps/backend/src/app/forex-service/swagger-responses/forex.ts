import { ApiProperty } from '@nestjs/swagger';
import { CurrencyCode } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

class CurrencyExchangeRate {
  @ApiProperty({ example: 'USD' })
  from_currency_code: string;

  @ApiProperty({ example: 'United States Dollar' })
  from_currency_name: string;

  @ApiProperty({ example: 'JPY' })
  to_currency_code: string;

  @ApiProperty({ example: 'Japanese Yen' })
  to_currency_name: string;

  @ApiProperty({ example: '158.296' })
  exchange_rate: string;
}

export class FxRatesResponse {
  @ApiProperty({ example: '3fab168b-c95c-4694-af19-19439061f10f' })
  forex_exchange_rates_id: string;

  @ApiProperty({ example: '2024-04-27T21:41:00.016Z' })
  forex_exchange_rates_expires_at: string;

  @ApiProperty({
    type: [CurrencyExchangeRate],
    example: [
      {
        from_currency_code: 'USD',
        from_currency_name: 'United States Dollar',
        to_currency_code: 'INR',
        to_currency_name: 'Indian Rupee',
        exchange_rate: '83.37800000',
      },
      {
        from_currency_code: 'USD',
        from_currency_name: 'United States Dollar',
        to_currency_code: 'JPY',
        to_currency_name: 'Japanese Yen',
        exchange_rate: '158.296',
      },
      {
        from_currency_code: 'USD',
        from_currency_name: 'United States Dollar',
        to_currency_code: 'AUD',
        to_currency_name: 'Australian Dollar',
        exchange_rate: '1.53020000',
      },
      {
        from_currency_code: 'USD',
        from_currency_name: 'United States Dollar',
        to_currency_code: 'EUR',
        to_currency_name: 'Euro',
        exchange_rate: '0.93470000',
      },
      {
        from_currency_code: 'USD',
        from_currency_name: 'United States Dollar',
        to_currency_code: 'SGD',
        to_currency_name: 'Singapore Dollar',
        exchange_rate: '1.36250000',
      },
      {
        from_currency_code: 'USD',
        from_currency_name: 'United States Dollar',
        to_currency_code: 'CNH',
        to_currency_name: 'Chinese Yuan Offshore',
        exchange_rate: '7.26660000',
      },
      //   ...........
    ],
  })
  currency_exchange_rates: CurrencyExchangeRate[];
}

export class FxConversionResponse {
  @ApiProperty({ example: '8337.8' })
  convertedAmount: Decimal;
  @ApiProperty({ example: 'INR' })
  currency: CurrencyCode;
}
