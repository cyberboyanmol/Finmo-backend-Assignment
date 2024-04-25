import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@forexsystem/nestjs-libraries/config/config.service';
import { WalletService } from '@forexsystem/nestjs-libraries/dal/repositories/wallet/wallet.service';
import { TopupAccountDto } from '@forexsystem/nestjs-libraries/dtos/user-wallet/topup-account.dto';
import { RedisService } from '@forexsystem/nestjs-libraries/dal/redis/redis.service';
import { BASE_CURRENCY } from '@forexsystem/helpers/interfaces';
import { CurrencyConverterService } from '@forexsystem/helpers/currency-converter/currency-converter.service';
import { ForexExchangeRatesLastestRedisKey } from '@forexsystem/helpers/utils/constants';
import { CurrencyCode } from '@prisma/client';
import { GetUserWalletBalanceData } from './interfaces/get-user-wallet-balance.interface';

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

  async getUserWalletBalance(): Promise<GetUserWalletBalanceData | null> {
    const forex_exchange_rates = await this._redisSerivce.getForexExchangeRate(
      ForexExchangeRatesLastestRedisKey
    );

    const balances: Record<CurrencyCode, number> = {
      USD: 0,
      AED: 0,
      AFN: 0,
      ALL: 0,
      AMD: 0,
      ANG: 0,
      AOA: 0,
      ARS: 0,
      AUD: 0,
      AWG: 0,
      AZN: 0,
      BAM: 0,
      BBD: 0,
      BDT: 0,
      BGN: 0,
      BHD: 0,
      BIF: 0,
      BMD: 0,
      BND: 0,
      BOB: 0,
      BRL: 0,
      BSD: 0,
      BTN: 0,
      BWP: 0,
      BZD: 0,
      CAD: 0,
      CDF: 0,
      CHF: 0,
      CLF: 0,
      CLP: 0,
      CNH: 0,
      CNY: 0,
      COP: 0,
      CUP: 0,
      CVE: 0,
      CZK: 0,
      DJF: 0,
      DKK: 0,
      DOP: 0,
      DZD: 0,
      EGP: 0,
      ERN: 0,
      ETB: 0,
      EUR: 0,
      FJD: 0,
      FKP: 0,
      GBP: 0,
      GEL: 0,
      GHS: 0,
      GIP: 0,
      GMD: 0,
      GNF: 0,
      GTQ: 0,
      GYD: 0,
      HKD: 0,
      HNL: 0,
      HRK: 0,
      HTG: 0,
      HUF: 0,
      ICP: 0,
      IDR: 0,
      ILS: 0,
      INR: 0,
      IQD: 0,
      IRR: 0,
      ISK: 0,
      JEP: 0,
      JMD: 0,
      JOD: 0,
      JPY: 0,
      KES: 0,
      KGS: 0,
      KHR: 0,
      KMF: 0,
      KPW: 0,
      KRW: 0,
      KWD: 0,
      KYD: 0,
      KZT: 0,
      LAK: 0,
      LBP: 0,
      LKR: 0,
      LRD: 0,
      LSL: 0,
      LYD: 0,
      MAD: 0,
      MDL: 0,
      MGA: 0,
      MKD: 0,
      MMK: 0,
      MNT: 0,
      MOP: 0,
      MRO: 0,
      MRU: 0,
      MUR: 0,
      MVR: 0,
      MWK: 0,
      MXN: 0,
      MYR: 0,
      MZN: 0,
      NAD: 0,
      NGN: 0,
      NOK: 0,
      NPR: 0,
      NZD: 0,
      OMR: 0,
      PAB: 0,
      PEN: 0,
      PGK: 0,
      PHP: 0,
      PKR: 0,
      PLN: 0,
      PYG: 0,
      QAR: 0,
      RON: 0,
      RSD: 0,
      RUB: 0,
      RUR: 0,
      RWF: 0,
      SAR: 0,
      SBD: 0,
      SCR: 0,
      SDG: 0,
      SDR: 0,
      SEK: 0,
      SGD: 0,
      SHP: 0,
      SLL: 0,
      SOS: 0,
      SRD: 0,
      SYP: 0,
      SZL: 0,
      THB: 0,
      TJS: 0,
      TMT: 0,
      TND: 0,
      TOP: 0,
      TRY: 0,
      TTD: 0,
      TWD: 0,
      TZS: 0,
      UAH: 0,
      UGX: 0,
      UYU: 0,
      UZS: 0,
      VND: 0,
      VUV: 0,
      WST: 0,
      XAF: 0,
      XCD: 0,
      XDR: 0,
      XOF: 0,
      XPF: 0,
      YER: 0,
      ZAR: 0,
      ZMW: 0,
      ZWL: 0,
    };

    const currentUserWalletbalance =
      await this._WalletService.getUserWalletBalance({
        user_id: '6503ba45-ba65-48ce-8156-7df09aa28d3e',
      });

    if (
      forex_exchange_rates &&
      forex_exchange_rates.currency_exchange_rates.length
    ) {
      for (const currencyExchangeRate of forex_exchange_rates.currency_exchange_rates) {
        const balanceInCurrency =
          CurrencyConverterService.convertFromBaseCurrency({
            exchangeRate: currencyExchangeRate.exchange_rate,
            amount:
              currentUserWalletbalance.account_balance as unknown as number,
            toCurrencyCode: currencyExchangeRate.to_currency_code,
          });
        balances[currencyExchangeRate.to_currency_code] = balanceInCurrency;
      }
    } else {
      // here from presistance database
    }

    return {
      forex_exchange_rates_id: forex_exchange_rates.forex_exchange_rates_id,
      forex_exchange_rates_expires_at:
        forex_exchange_rates.forex_exchange_rates_expires_at,
      balances,
    };
  }
}
