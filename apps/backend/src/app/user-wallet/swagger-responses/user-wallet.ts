import { ApiProperty } from '@nestjs/swagger';
import { CurrencyCode } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class TopupAccountResponse {
  @ApiProperty({ example: 'ca4e9010-ab4e-4487-b80b-dda171b6b3db' })
  account_id: string;
  @ApiProperty({ example: '5eee1b4c-9a86-443f-828a-4fdd9eaaae3f' })
  user_id: string;
  @ApiProperty({ example: '12.65350988022439' })
  account_balance: Decimal;
  @ApiProperty({ example: 'USD' })
  currency_code: CurrencyCode;
  @ApiProperty({ example: '2024-04-27T21:37:20.374Z' })
  created_at: Date;
  @ApiProperty({ example: '2024-04-27T21:37:54.934Z' })
  updated_at: Date;
}

export class GetUserBalanceResponse {
  @ApiProperty({ example: 'ca4e9010-ab4e-4487-b80b-dda171b6b3db' })
  account_id: string;

  @ApiProperty({ example: '5eee1b4c-9a86-443f-828a-4fdd9eaaae3f' })
  user_id: string;

  @ApiProperty({
    example: {
      INR: 1055.0243467933492,
      JPY: 2003,
      USD: 12.65350988022439,
      AUD: 19.36240081871936,
      SGD: 17.24040721180573,
      EUR: 11.827235685045737,
      CNH: 91.94799489563856,
      // ................
    },
  })
  balances: Record<CurrencyCode, Decimal>;
}
