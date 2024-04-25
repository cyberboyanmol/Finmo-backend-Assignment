import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@forexsystem/nestjs-libraries/config/config.service';
import { WalletService } from '@forexsystem/nestjs-libraries/dal/repositories/wallet/wallet.service';
import { TopupAccountDto } from '@forexsystem/nestjs-libraries/dtos/user-wallet/topup-account.dto';
import { RedisService } from '@forexsystem/nestjs-libraries/dal/redis/redis.service';
import { BASE_CURRENCY } from '@forexsystem/helpers/interfaces';
import { CurrencyConverterService } from '@forexsystem/helpers/currency-converter/currency-converter.service';
import { Decimal } from '@prisma/client/runtime/library';
@Injectable()
export class UserWalletService {
  private readonly logger = new Logger(UserWalletService.name);
  constructor(
    private readonly _WalletService: WalletService,
    private _configService: ConfigService,
    private readonly _redisSerivce: RedisService
  ) {}
  async addBalanceToWallet(body: TopupAccountDto) {
    // fetch the live fx rate of base currency and user given currency from the InMemory db

    const forex_exchange_rates = await this._redisSerivce.getForexExchangeRate(
      `${BASE_CURRENCY}:${body.currency}`
    );

    if (!forex_exchange_rates) {
      throw new BadRequestException('Wrong currency code');
    }
    const amountInBaseCurrency = CurrencyConverterService.convertToBaseCurrency(
      {
        fromCurrencyCode: body.currency,
        exchangeRate:
          forex_exchange_rates.currency_exchange_rates[0].exchange_rate,
        amount: body.amount,
      }
    );

    // update the balance in database

    const currentUserWalletbalance =
      await this._WalletService.getUserWalletBalance({
        user_id: '6503ba45-ba65-48ce-8156-7df09aa28d3e',
      });

    const updateBalance = CurrencyConverterService.sumBalances({
      prevBalance: currentUserWalletbalance.account_balance,
      amount: amountInBaseCurrency,
    });

    const updateUserWalletBalance =
      await this._WalletService.addBalancetoUserWallet({
        user_id: '6503ba45-ba65-48ce-8156-7df09aa28d3e',
        account_balance: updateBalance,
      });

    return updateUserWalletBalance;
  }
}
