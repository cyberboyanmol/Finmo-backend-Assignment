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
import { Decimal } from '@prisma/client/runtime/library';
import { ForexExchangeRatesService } from '@forexsystem/nestjs-libraries/dal/repositories/forex-exchange-rates/forex-exchange-rates.service';

@Injectable()
export class UserWalletService {
  private readonly logger = new Logger(UserWalletService.name);
  constructor(
    private readonly _walletService: WalletService,
    private _configService: ConfigService,
    private _forexExchangeRatesService: ForexExchangeRatesService,
    private readonly _redisService: RedisService
  ) {}

  async addBalanceToWallet(body: TopupAccountDto) {
    const { currency, amount } = body;
    const user_id = '6503ba45-ba65-48ce-8156-7df09aa28d3e';

    const forexExchangeRates = await this._redisService.getForexExchangeRate(
      `${BASE_CURRENCY}:${currency}`
    );

    if (!forexExchangeRates) {
      throw new BadRequestException('Wrong currency code');
    }

    const exchangeRate = Number(
      forexExchangeRates.currency_exchange_rates[0].exchange_rate
    );
    const amountInBaseCurrency = CurrencyConverterService.convertToBaseCurrency(
      {
        fromCurrencyCode: currency,
        exchangeRate,
        amount,
      }
    );

    const currentUserWalletBalance =
      await this._walletService.getUserWalletBalance({ user_id });

    const updatedBalance = CurrencyConverterService.sumBalances({
      prevBalance: currentUserWalletBalance.account_balance,
      amount: new Decimal(amountInBaseCurrency),
    });

    const updateUserWalletBalance =
      await this._walletService.addBalancetoUserWallet({
        user_id,
        account_balance: updatedBalance,
      });

    return updateUserWalletBalance;
  }

  async getUserWalletBalance(): Promise<GetUserWalletBalanceData | null> {
    const user_id = '6503ba45-ba65-48ce-8156-7df09aa28d3e';
    const currentUserWalletBalance =
      await this._walletService.getUserWalletBalance({ user_id });

    const forexExchangeRatesFromRedis =
      await this._redisService.getForexExchangeRate(
        ForexExchangeRatesLastestRedisKey
      );

    const forexExchangeRatesFromDb = forexExchangeRatesFromRedis
      ? null
      : (
          await this._forexExchangeRatesService.getLatestForexExchangeRates()
        )[0];

    const forexExchangeRates =
      forexExchangeRatesFromRedis || forexExchangeRatesFromDb;

    if (
      !forexExchangeRates ||
      !forexExchangeRates.currency_exchange_rates.length
    ) {
      return null;
    }

    const balances: Record<CurrencyCode, Decimal> = {
      AED: new Decimal(0),
      AFN: new Decimal(0),
      ALL: new Decimal(0),
      AMD: new Decimal(0),
      ANG: new Decimal(0),
      AOA: new Decimal(0),
      ARS: new Decimal(0),
      AUD: new Decimal(0),
      AWG: new Decimal(0),
      AZN: new Decimal(0),
      BAM: new Decimal(0),
      BBD: new Decimal(0),
      BDT: new Decimal(0),
      BGN: new Decimal(0),
      BHD: new Decimal(0),
      BIF: new Decimal(0),
      BMD: new Decimal(0),
      BND: new Decimal(0),
      BOB: new Decimal(0),
      BRL: new Decimal(0),
      BSD: new Decimal(0),
      BTN: new Decimal(0),
      BWP: new Decimal(0),
      BZD: new Decimal(0),
      CAD: new Decimal(0),
      CDF: new Decimal(0),
      CHF: new Decimal(0),
      CLF: new Decimal(0),
      CLP: new Decimal(0),
      CNH: new Decimal(0),
      CNY: new Decimal(0),
      COP: new Decimal(0),
      CUP: new Decimal(0),
      CVE: new Decimal(0),
      CZK: new Decimal(0),
      DJF: new Decimal(0),
      DKK: new Decimal(0),
      DOP: new Decimal(0),
      DZD: new Decimal(0),
      EGP: new Decimal(0),
      ERN: new Decimal(0),
      ETB: new Decimal(0),
      EUR: new Decimal(0),
      FJD: new Decimal(0),
      FKP: new Decimal(0),
      GBP: new Decimal(0),
      GEL: new Decimal(0),
      GHS: new Decimal(0),
      GIP: new Decimal(0),
      GMD: new Decimal(0),
      GNF: new Decimal(0),
      GTQ: new Decimal(0),
      GYD: new Decimal(0),
      HKD: new Decimal(0),
      HNL: new Decimal(0),
      HRK: new Decimal(0),
      HTG: new Decimal(0),
      HUF: new Decimal(0),
      ICP: new Decimal(0),
      IDR: new Decimal(0),
      ILS: new Decimal(0),
      INR: new Decimal(0),
      IQD: new Decimal(0),
      IRR: new Decimal(0),
      ISK: new Decimal(0),
      JEP: new Decimal(0),
      JMD: new Decimal(0),
      JOD: new Decimal(0),
      JPY: new Decimal(0),
      KES: new Decimal(0),
      KGS: new Decimal(0),
      KHR: new Decimal(0),
      KMF: new Decimal(0),
      KPW: new Decimal(0),
      KRW: new Decimal(0),
      KWD: new Decimal(0),
      KYD: new Decimal(0),
      KZT: new Decimal(0),
      LAK: new Decimal(0),
      LBP: new Decimal(0),
      LKR: new Decimal(0),
      LRD: new Decimal(0),
      LSL: new Decimal(0),
      LYD: new Decimal(0),
      MAD: new Decimal(0),
      MDL: new Decimal(0),
      MGA: new Decimal(0),
      MKD: new Decimal(0),
      MMK: new Decimal(0),
      MNT: new Decimal(0),
      MOP: new Decimal(0),
      MRO: new Decimal(0),
      MRU: new Decimal(0),
      MUR: new Decimal(0),
      MVR: new Decimal(0),
      MWK: new Decimal(0),
      MXN: new Decimal(0),
      MYR: new Decimal(0),
      MZN: new Decimal(0),
      NAD: new Decimal(0),
      NGN: new Decimal(0),
      NOK: new Decimal(0),
      NPR: new Decimal(0),
      NZD: new Decimal(0),
      OMR: new Decimal(0),
      PAB: new Decimal(0),
      PEN: new Decimal(0),
      PGK: new Decimal(0),
      PHP: new Decimal(0),
      PKR: new Decimal(0),
      PLN: new Decimal(0),
      PYG: new Decimal(0),
      QAR: new Decimal(0),
      RON: new Decimal(0),
      RSD: new Decimal(0),
      RUB: new Decimal(0),
      RUR: new Decimal(0),
      RWF: new Decimal(0),
      SAR: new Decimal(0),
      SBD: new Decimal(0),
      SCR: new Decimal(0),
      SDG: new Decimal(0),
      SDR: new Decimal(0),
      SEK: new Decimal(0),
      SGD: new Decimal(0),
      SHP: new Decimal(0),
      SLL: new Decimal(0),
      SOS: new Decimal(0),
      SRD: new Decimal(0),
      SYP: new Decimal(0),
      SZL: new Decimal(0),
      THB: new Decimal(0),
      TJS: new Decimal(0),
      TMT: new Decimal(0),
      TND: new Decimal(0),
      TOP: new Decimal(0),
      TRY: new Decimal(0),
      TTD: new Decimal(0),
      TWD: new Decimal(0),
      TZS: new Decimal(0),
      UAH: new Decimal(0),
      UGX: new Decimal(0),
      USD: new Decimal(0),
      UYU: new Decimal(0),
      UZS: new Decimal(0),
      VND: new Decimal(0),
      VUV: new Decimal(0),
      WST: new Decimal(0),
      XAF: new Decimal(0),
      XCD: new Decimal(0),
      XDR: new Decimal(0),
      XOF: new Decimal(0),
      XPF: new Decimal(0),
      YER: new Decimal(0),
      ZAR: new Decimal(0),
      ZMW: new Decimal(0),
      ZWL: new Decimal(0),
    };

    for (const currencyExchangeRate of forexExchangeRates.currency_exchange_rates) {
      const balanceInCurrency =
        CurrencyConverterService.convertFromBaseCurrency({
          exchangeRate: Number(currencyExchangeRate.exchange_rate),
          amount: Number(currentUserWalletBalance.account_balance),
          toCurrencyCode: currencyExchangeRate.to_currency_code,
        });

      balances[currencyExchangeRate.to_currency_code] = new Decimal(
        balanceInCurrency
      );
    }

    return {
      forex_exchange_rates_id: forexExchangeRates.forex_exchange_rates_id,
      forex_exchange_rates_expires_at: String(
        forexExchangeRates.forex_exchange_rates_expires_at
      ),
      balances,
    };
  }
}
