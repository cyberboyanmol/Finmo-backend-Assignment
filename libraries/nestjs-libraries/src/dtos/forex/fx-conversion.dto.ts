import { CurrencyCode } from '@prisma/client';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  IsEnum,
} from 'class-validator';

export class FxConversionDto {
  @IsNotEmpty()
  @IsString()
  forex_exchange_rates_id: string;

  @IsString()
  @IsEnum(CurrencyCode)
  @IsNotEmpty()
  from_currency_code: string;

  @IsString()
  @IsEnum(CurrencyCode)
  @IsNotEmpty()
  to_currency_code: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive({ message: 'Amount must be greater than zero.' })
  amount: number;
}
