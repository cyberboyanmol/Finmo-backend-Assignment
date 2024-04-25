import { CurrencyCode } from '@prisma/client';
import { IsDecimal, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class TopupAccountDto {
  @IsString()
  @IsEnum(CurrencyCode)
  @IsNotEmpty()
  readonly currency: CurrencyCode;

  @IsDecimal()
  @IsNotEmpty()
  readonly amount: number;
}
