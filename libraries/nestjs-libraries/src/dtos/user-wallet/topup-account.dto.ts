import { CurrencyCode } from '@prisma/client';
import {
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class TopupAccountDto {
  @IsString()
  @IsEnum(CurrencyCode)
  @IsNotEmpty()
  readonly currency: CurrencyCode;

  @IsNumber()
  @IsNotEmpty()
  readonly amount: number;
}
