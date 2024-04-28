import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    enum: CurrencyCode,
    description: 'The currency code of the amount to top up',
  })
  @IsString()
  @IsEnum(CurrencyCode)
  @IsNotEmpty()
  readonly currency: CurrencyCode;

  @ApiProperty({
    example: 100,
    description: 'The amount to top up (must be greater than zero)',
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive({ message: 'Amount must be greater than zero.' })
  readonly amount: number;
}
