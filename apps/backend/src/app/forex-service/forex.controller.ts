import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { FxConversionDto } from '@forexsystem/nestjs-libraries/dtos/forex/fx-conversion.dto';
import { ForexService } from './forex.service';
import { GetFxRatesInterface } from './interfaces/get-fx-rates.interfaces';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  FxConversionResponse,
  FxRatesResponse,
} from './swagger-responses/forex';

@ApiTags('ForexService')
@Controller()
export class ForexController {
  constructor(private readonly _forexService: ForexService) {}

  @Post('fx-conversion')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'This API performs an FX conversion between currencies.',
    description:
      'This API performs an FX conversion using the provided forex_exchange_rates_id and converts the specified amount from one currency to another. NOTE: **"Currently this endpoint is only working for the USD->JPY currency conversion"**',
  })
  @ApiBody({ type: FxConversionDto, description: 'Data for FX conversion' })
  @ApiOkResponse({
    description: 'Return the Converted amount in requested currency',
    type: FxConversionResponse,
  })
  @ApiBadRequestResponse({
    description: 'Some character error or type error',
  })
  async fxConversion(@Body() body: FxConversionDto) {
    const res = await this._forexService.fxConversionFormBaseCurrency(body);
    return res;
  }

  @ApiOperation({
    summary:
      'This API  endpoint gives live FX exchange rates between currencies',
    description:
      'This API endpoint gives live FX exchanges rates. NOTE : **Currently this endpoint is only working for the USD->JPY currency**',
  })
  @ApiOkResponse({
    description:
      'It Return a list of FX conversion rates between different currencies',
    type: FxRatesResponse,
  })
  @ApiBadRequestResponse({
    description: 'Some character error or type error',
  })
  @HttpCode(HttpStatus.OK)
  @Get('fx-rates')
  async getFxRates(): Promise<GetFxRatesInterface> {
    const res = await this._forexService.getLastestFxRates();
    return res;
  }
}
