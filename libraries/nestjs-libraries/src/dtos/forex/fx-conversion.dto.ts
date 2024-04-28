import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 'abc123',
    description: 'The ID of the forex exchange rates',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  forex_exchange_rates_id: string;

  @ApiProperty({
    enum: CurrencyCode,
    example:"USD",
    description: 'The currency code of the source currency',
  })
  @IsEnum(CurrencyCode)
  @IsString()
  @IsNotEmpty()
  from_currency_code: CurrencyCode;

  @ApiProperty({
    enum: CurrencyCode,
    example:"INR",
    description: 'The currency code of the target currency',
  })
  @IsEnum(CurrencyCode)
  @IsString()
  @IsNotEmpty()
  to_currency_code: CurrencyCode;

  @ApiProperty({
    example: 100,
    description: 'The amount to be converted (must be greater than zero)',
  })
  @IsPositive({ message: 'Amount must be greater than zero.' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
