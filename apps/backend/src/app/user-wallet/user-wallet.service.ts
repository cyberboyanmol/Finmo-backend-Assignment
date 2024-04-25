import { BadRequestException, Injectable } from '@nestjs/common';

import { ConfigService } from '@forexsystem/nestjs-libraries/config/config.service';
import { WalletService } from '@forexsystem/nestjs-libraries/dal/repositories/wallet/wallet.service';

@Injectable()
export class UserWalletService {
  constructor(
    private readonly _WalletService: WalletService,
    private _configService: ConfigService
  ) {}
}
