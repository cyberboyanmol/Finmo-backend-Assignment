import { CurrencyCode } from '@prisma/client';
import {
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class TopupAccountDto {
  @IsString()
  @IsEnum(CurrencyCode)
  @IsNotEmpty()
  readonly currency: CurrencyCode;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive({ message: 'Amount must be greater than zero.' })
  readonly amount: number;
}
