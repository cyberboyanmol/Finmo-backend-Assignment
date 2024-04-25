import { CurrencyCode, CurrencyExchangeRate } from '@prisma/client';
import { BASE_CURRENCY } from '../interfaces/currency-exchange-rate.interface';

export class CurrencyConverterService {
  /**
   * The function `convertToBaseCurrency` converts an amount from a given currency to the base currency
   * using the exchange rate.
   * @param data - exchangeRate: number - the exchange rate used for conversion
   * @returns The `convertToBaseCurrency` function returns the converted amount in the base currency. If
   * the `fromCurrencyCode` is the same as the `BASE_CURRENCY`, it simply returns the original amount.
   * Otherwise, it calculates the converted amount by dividing the original amount by the exchange rate
   * and returns that value.
   */
  static convertToBaseCurrency(data: {
    exchangeRate: number;
    fromCurrencyCode: CurrencyCode;
    amount: number;
  }) {
    if (data.fromCurrencyCode === BASE_CURRENCY) {
      return data.amount;
    } else {
      const convertedAmount = data.amount / data.exchangeRate;
      return convertedAmount;
    }
  }

  /**
   * The function `convertFromBaseCurrency` converts an amount from a base currency to a target currency
   * using the exchange rate.
   * @param data - The `convertFromBaseCurrency` function takes in an object `data` with the following
   * parameters:
   * @returns The `convertFromBaseCurrency` function returns either the original amount if the
   * `toCurrencyCode` is the base currency, or the converted amount calculated by multiplying the
   * original amount by the exchange rate if the `toCurrencyCode` is different from the base currency.
   */
  static convertFromBaseCurrency(data: {
    exchangeRate: number;
    toCurrencyCode: CurrencyCode;
    amount: number;
  }) {
    if (data.toCurrencyCode === BASE_CURRENCY) {
      return data.amount;
    } else {
      const convertedAmount = data.amount * data.exchangeRate;
      return convertedAmount;
    }
  }

  /**
   * The function converts an amount from one currency to another using exchange rates.
   * @param data - The `convert` function takes in an object `data` with the following properties:
   * @returns The `convert` function is returning the amount converted to the target currency based on
   * the provided exchange rates and amount in the base currency.
   */
  static convert(data: {
    fromCurrencyCode: CurrencyCode;
    fromCurrencyExchangeRate: number;
    toCurrencyCode: CurrencyCode;
    toCurrencyExchangeRate: number;
    amount: number;
  }) {
    const amountInBaseCurrency = this.convertToBaseCurrency({
      fromCurrencyCode: data.fromCurrencyCode,
      amount: data.amount,
      exchangeRate: data.fromCurrencyExchangeRate,
    });

    const amountInTargetCurrency = this.convertFromBaseCurrency({
      toCurrencyCode: data.toCurrencyCode,
      amount: amountInBaseCurrency,
      exchangeRate: data.toCurrencyExchangeRate,
    });

    return amountInTargetCurrency;
  }
}
