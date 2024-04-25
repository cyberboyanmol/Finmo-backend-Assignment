import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@forexsystem/nestjs-libraries/config/config.service';
import { TopupAccountDto } from '@forexsystem/nestjs-libraries/dtos/user-wallet/topup-account.dto';
import { UserWalletService } from './user-wallet.service';

@Controller('accounts')
export class UserWalletController {
  constructor(
    private _configService: ConfigService,
    private _userWalletService: UserWalletService
  ) {}

  // ✅ TODO: Add the AuthGuard
  @Post('topup')
  async topupAccount(@Body() body: TopupAccountDto) {
    try {
      const res = await this._userWalletService.addBalanceToWallet(body);
      return res;
    } catch (e) {
      return e.message;
    }
  }

  @Get('balance')
  async getUserBalance() {
    try {
      const res = await this._userWalletService.getUserWalletBalance();
      return res;
    } catch (e) {
      return e.message;
    }
  }
}
