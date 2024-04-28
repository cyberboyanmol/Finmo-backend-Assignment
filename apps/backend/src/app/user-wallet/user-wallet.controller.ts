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
import { ConfigService } from '@forexsystem/nestjs-libraries/config/config.service';
import { TopupAccountDto } from '@forexsystem/nestjs-libraries/dtos/user-wallet/topup-account.dto';
import { UserWalletService } from './user-wallet.service';
import { AuthenticatedRequest } from '../../interfaces/auth-request.interface';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  GetUserBalanceResponse,
  TopupAccountResponse,
} from './swagger-responses/user-wallet';
@ApiTags('User-Wallet')
@Controller('accounts')
export class UserWalletController {
  constructor(
    private _configService: ConfigService,
    private _userWalletService: UserWalletService
  ) {}

  @Post('topup')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'This API allows users to top up their account with a specified amount in a given currency.',
    description:
      'This API allows users to top up their account with a specified amount in a given currency.  NOTE : **Currently this api endpoint only supports JPY Currency**',
  })
  @ApiOkResponse({
    description: 'It Return the updated user wallet balance',
    type: TopupAccountResponse,
  })
  @ApiBadRequestResponse({
    description: 'Some character error or type error',
  })
  @ApiBearerAuth('JWT')
  async topupAccount(
    @Req() req: AuthenticatedRequest,
    @Body() body: TopupAccountDto
  ): Promise<TopupAccountResponse> {
    const { user_id } = req.user;
    const res = await this._userWalletService.addBalanceToWallet(user_id, body);
    return res;
  }

  @ApiOperation({
    summary: `This API retrieves the balances in all currencies for the user's account`,
    description:
      'This API allows users to top up their account with a specified amount in a given currency. NOTE: **Currently this api endpoint only supports JPY currency**',
  })
  @ApiOkResponse({
    description: 'It Return list of user wallet balance in all currencies',
    type: GetUserBalanceResponse,
  })
  @ApiBadRequestResponse({
    description: 'Some character error or type error',
  })
  @ApiBearerAuth('JWT')
  @Get('balance')
  @HttpCode(HttpStatus.OK)
  async getUserBalance(
    @Req() req: AuthenticatedRequest
  ): Promise<GetUserBalanceResponse> {
    const { user_id } = req.user;
    const res = await this._userWalletService.getUserWalletBalance(user_id);
    return res;
  }
}
