import { CurrencyCode } from '@prisma/client';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class FxConversionDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  forex_exchange_rates_id: string;

  @IsEnum(CurrencyCode)
  @IsString()
  @IsNotEmpty()
  from_currency_code: CurrencyCode;

  @IsEnum(CurrencyCode)
  @IsString()
  @IsNotEmpty()
  to_currency_code: CurrencyCode;

  @IsPositive({ message: 'Amount must be greater than zero.' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
