import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@forexsystem/nestjs-libraries/config/config.service';
import { TopupAccountDto } from '@forexsystem/nestjs-libraries/dtos/user-wallet/topup-account.dto';

@Controller('accounts')
export class UserWalletController {
  constructor(private _configService: ConfigService) {}

  // ✅ TODO: Add the AuthGuard
  @Post('topup')
  async topupAccount(@Body() body: TopupAccountDto) {
    try {
      return body;
    } catch (e) {
      return e.message;
    }
  }

  @Get('balance')
  async getUserWalletBalance() {
    try {
      return { balances: { USD: 1000, EUR: 500, GBP: 300 } };
    } catch (e) {
      return e.message;
    }
  }
}
