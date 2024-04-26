import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@forexsystem/nestjs-libraries/config/config.service';
import { FxConversionDto } from '@forexsystem/nestjs-libraries/dtos/forex/fx-conversion.dto';
import { ForexService } from './forex.service';
import { GetFxRatesInterface } from './interfaces/get-fx-rates.interfaces';

@Controller()
export class ForexController {
  constructor(
    private _configService: ConfigService,
    private readonly _forexService: ForexService
  ) {}

  // ✅ TODO: Add the AuthGuard
  @Post('fx-conversion')
  async fxConversion(@Body() body: FxConversionDto) {
    try {
      const res = await this._forexService.fxConversionFormBaseCurrency(body);
      return res;
    } catch (e) {
      return e.message;
    }
  }

  @Get('fx-rates')
  async getFxRates(): Promise<GetFxRatesInterface> {
    try {
      const res = await this._forexService.getLastestFxRates();
      return res;
    } catch (e) {
      return e.message;
    }
  }
}
