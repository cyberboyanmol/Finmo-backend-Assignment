import type { buildForexExchangeRateUrlProps } from '../types/index';

const BASE_URL = `https://www.alphavantage.co/query`;

export function buildForexExchangeRateUrl({
  to_currency,
  apiKey,
}: buildForexExchangeRateUrlProps): string {
  const url = `${BASE_URL}?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=${to_currency}&apikey=${apiKey}`;
  return url;
}
