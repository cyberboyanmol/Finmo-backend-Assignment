# Forex-trading-system Assignment

> This is Implementation of Forex Trading backend system using Nestjs.

# Table of Contents

1. [Forex-trading-system Assignment](#forex-trading-system-assignment)

- [Key Features](#key-features)

2. [Installation Guide](#installation-guide)

- [1. Prerequisites](#1-prerequisites)
- [2. Project Setup](#2-project-setup)
- [3. Install Dependencies](#3-install-dependencies)
- [4. Run the PostgreSQL and Redis Server using Docker](#4-run-the-postgresql-and-redis-server-using-docker)
- [5. Generate Prisma Client](#5-generate-prisma-client)
- [6. Apply Database Migrations](#6-apply-database-migrations)
- [6. Run the Project](#6-run-the-project)
- [Run each apps separately (Optional)](#run-the-apps-separately-optional)
- [Important Note](#mportant-note)
- [To Unlock Full Currency Support](#to-unlock-full-currency-support)
- [How to Enable Full Currency Support (if you have a premium API key)](#how-to-enable-full-currency-support-if-you-have-a-premium-api-key)
  - [Code Updates (Backend App)](#code-updates-backend-app)
  - [Activate Cron Job (Cron App)](#activate-cron-job-cron-app)

3. [API Reference](#api-reference)

- [Base Url](#base-url)
- [Swagger Docs](#swagger-docs)
- [Authentication](#authentication)
  - [Register User](#register-user)
  - [Login User](#login-user)
  - [Refresh Token](#refresh-token)
- [User Wallet](#user-wallet)
- [Forex Endpoint](#forex-endpoint)

4. [Support](#support)

# Key Features:

- **Live FX Exchange Rates**: Stay ahead of the market with live foreign exchange rates that are updated every 30 seconds, ensuring you have access to the most up-to-date pricing information for informed trading decisions.

- **Secure Authentication and Authorization**: Robust authentication and authorization mechanisms are in place, employing industry-standard access and refresh token protocols. This ensures that your trading activities and sensitive data remain secure and accessible only to authorized users.

- **User Wallet Management**: Users can easily topup their wallet account and check the balances in nearly all currencies.

- **Real-Time Currency Conversions**: Leveraging the live exchange rates, users can convert amounts between different currencies with precision and accuracy.

## Installation Guide

### 1. Prerequisites

- Node.js >=v20.10.0 and Docker: Install the latest versions from their respective official websites: [Nodejs](https://nodejs.org/) and [Docker](https://docker.com).

### 2. Project Setup:

- Clone the project repository using Git.
- Navigate to the project directory using the <code>cd</code> command in your terminal.
- Create a file named <code>.env</code> in the project's root directory.
- Copy and paste the contents of the <code>.env.example</code> file into the newly created .env file. Replace the placeholder values with your own credentials (e.g., database connection details, API keys).

### 3. Install Dependencies:

Run the following command in your terminal to install the project's dependencies:

```bash
  npm install
```

### 4. Run the PostgreSQL and Redis Server using Docker (optional):

Run the following command to apply database migrations, ensuring your database schema is up-to-date:

```yaml
docker-compose -f docker-compose.dev.yaml up -d
```

### 5. Generate Prisma Client:

Run the following command to generate the Prisma client, which facilitates interaction with your database:

```bash
  npm run prisma:generate
```

### 6. Apply Database Migrations:

Run the following command to apply database migrations, ensuring your database schema is up-to-date:

```bash
  npm run prisma:migrate:dev
```

### 6. Run the Project:

- Run the Project (In one command)

```bash
  npm run dev
```

## Run each apps separately (Optional):

- Run Workers

```bash
  npm run workers
```

- Run Cron

```bash
  npm run cron
```

- Run Backend

```bash
  npm run backend
```

# ⚠️ Important Note:

This project utilizes the Alphavantage.co API (s://www.alphavantage.co/) for retrieving live exchange rates. However, the free tier has a **strict rate limit of 25 requests per day**.

### Currently:

The project is configured using the **demo API key**, fetching only the **USD to JPY exchange rate every 30 seconds**.

## To Unlock Full Currency Support:

You'll need a premium API key from Alphavantage.co, granting access to exchange rates for all currencies and a higher request limit (i.e 300+ request per minute).

# How to Enable Full Currency Support (if you have a premium API key):

## Code Updates (Backend App):

- In the <code>forex.service.ts</code> file, uncomment the following two functions

```typescript
  async fxConversion(body: FxConversionDto) {
    const {
      forex_exchange_rates_id,
      from_currency_code,
      to_currency_code,
      amount,
    } = body;
    const redisData = await this._redisService.getForexExchangeRate(
      ForexExchangeRatesLastestRedisKey
    );
    const dbData = forex_exchange_rates_id
      ? await this._forexExchangeRatesService.getForexExchangeRatesById({
          forex_exchange_rates_id,
        })
      : (
          await this._forexExchangeRatesService.getLatestForexExchangeRates()
        )[0];

    const exchangeRates = this.getExchangeRates(
      redisData,
      dbData,
      from_currency_code,
      to_currency_code
    );

    if (!exchangeRates) {
      throw new Error('Exchange rates not found');
    }

    const { fromCurrencyExchangeRate, toCurrencyExchangeRate } = exchangeRates;
    const result = CurrencyConverterService.convert({
      fromCurrencyCode: from_currency_code,
      fromCurrencyExchangeRateFromBaseCurrency:
        fromCurrencyExchangeRate.exchange_rate,
      toCurrencyCode: to_currency_code,
      toCurrencyExchangeRateFromBaseCurrency:
        toCurrencyExchangeRate.exchange_rate,
      amount,
    });

    return {
      convertedAmount: result,
      currency: to_currency_code,
    };
  }
```

```typescript
 private getExchangeRates(
    redisData: ForexExchangeRatesRedisData | null,
    dbData: ForexExchangeRatesDbData | null,
    fromCurrencyCode: CurrencyCode,
    toCurrencyCode: CurrencyCode
  ): {
    fromCurrencyExchangeRate: CurrencyExchangeRate;
    toCurrencyExchangeRate: CurrencyExchangeRate;
  } | null {
    const data =
      redisData?.currency_exchange_rates ||
      dbData?.currency_exchange_rates ||
      [];

    const fromCurrencyExchangeRate = data.find(
      (rate) => rate.to_currency_code === fromCurrencyCode
    );
    const toCurrencyExchangeRate = data.find(
      (rate) => rate.to_currency_code === toCurrencyCode
    );

    if (!fromCurrencyExchangeRate || !toCurrencyExchangeRate) {
      return null;
    }

    return { fromCurrencyExchangeRate, toCurrencyExchangeRate };
  }
```

- Code Modification <code>Forex.controller.ts</code>

```typescript
const res = await this._forexService.fxConversionFormBaseCurrency(body);
```

to

```typescript
const res = await this._forexService.fxConversion(body);
```

## Activate Cron Job (Cron App):

Uncomment the cron scheduler in the file to enable fetching of exchange rates for all currencies every 30 seconds (recommended only if you have a premium API key).

```typescript
@Cron(CronExpression.EVERY_30_SECONDS)
  async syncForexRatesEvery30Seconds() {
    const forex_exchange_rates_expires_at_milliseconds = 1000 * 30;
    const forex_exchange_rates_id = uuidV4();
    const forex_exchange_rates_expires_at = generateTimestamp(
      forex_exchange_rates_expires_at_milliseconds
    );
    currencyCodesWithName.map(async (currency: CurrencyCodeInterface) => {
      const params: ForexExchangeRateUrlProps = {
        to_currency: currency.code,
        apiKey: this._configService.ALPHA_VANTAGE_API_KEYS,
      };
      const url = getForexExchangeRateUrl(params);

      const eventData: SyncForexExchangeRateJob['data'] = {
        url,
        forex_exchange_rates_id,
        forex_exchange_rates_expires_at,
      };

      console.log('adding job :', forex_exchange_rates_id);
      this._forexExchangeRatesQueue.add(
        ForexJobPattern.SYNC_FOREX_EXCHANGE_RATES,
        { ...eventData }
      );
    });
  }
```

and comment :

```typescript
  // THIS CRON WILL ONLY ADD THE USD TO INR FETCHING URL
  // DUE TO ALPHA VANTAGE API HARD RATE LIMIT (i.e 25 requests a day only)
  @Cron(CronExpression.EVERY_30_SECONDS)
  async syncForexExchangeRatesEvery30SecondsWithDemoKey() {
    const forex_exchange_rates_expires_at_milliseconds = 1000 * 30;
    const forex_exchange_rates_id = uuidV4();
    const forex_exchange_rates_expires_at = generateTimestamp(
      forex_exchange_rates_expires_at_milliseconds
    );
    const params: ForexExchangeRateUrlProps = {
      to_currency: 'JPY',
      apiKey: this._configService.ALPHA_VANTAGE_API_KEYS,
    };

    const url = getForexExchangeRateUrl(params);

    const eventData: SyncForexExchangeRateJob['data'] = {
      url,
      forex_exchange_rates_id,
      forex_exchange_rates_expires_at,
    };

    this._forexExchangeRatesQueue.add(
      ForexJobPattern.SYNC_FOREX_EXCHANGE_RATES,
      { ...eventData }
    );
    console.log('Adding jobs to queue :', forex_exchange_rates_id);
  }
```

# API Reference

#### Base Url

```
  http://localhost:9000/
```

#### Swagger Docs

```
  http://localhost:9000/api/v1/docs
```

## Authentication

#### Register User

```
  POST /api/v1/auth/register
```

| Parameter   | Type     | Description              |
| :---------- | :------- | :----------------------- |
| `email`     | `string` | **Required**.            |
| `password`  | `string` | **Required**.            |
| `firstName` | `string` | **Required**.            |
| `lastName`  | `string` | **Required**. (Optional) |

#### Login User

```
  POST /api/v1/auth/login
```

| Parameter  | Type     | Description   |
| :--------- | :------- | :------------ |
| `email`    | `string` | **Required**. |
| `password` | `string` | **Required**. |

#### Refresh Token

```
  GET /api/v1/auth/refresh-token
```

```cookie
Cookie: refresh_token=<your_refresh_token>
```

## User Wallet

### 1. This API endpoint allows users to top up their account with a specified amount in a given currency.

> 📝 **NOTE**: Currently, this API endpoint only supports the JPY currency.

```
  POST /api/v1/accounts/topup
```

| Parameter  | Type     | Description   |
| :--------- | :------- | :------------ |
| `currency` | `string` | **Required**. |
| `amount`   | `string` | **Required**. |

### 2. This API retrieves the balances in all currencies for the user's account..

> 📝 **NOTE**: Currently, this API endpoint only supports the JPY currency.

```
  GET /api/v1/accounts/balance
```

## Forex Endpoint

#### 1.This API performs an FX conversion using the provided <code>forex_exchange_rates_id</code> and converts the specified amount from one currency to another.

> 📝 **NOTE**: Currently, this endpoint is only working for the USD->JPY currency conversion.

```
  POST /api/v1/fx-conversion
```

| Parameter                 | Type     | Description   |
| :------------------------ | :------- | :------------ |
| `forex_exchange_rates_id` | `string` | **Required**. |
| `from_currency_code`      | `string` | **Required**. |
| `to_currency_code`        | `string` | **Required**. |
| `amount`                  | `string` | **Required**. |

#### 2.This API endpoint gives a list of live FX exchange rates for all currencies.

> 📝 **NOTE**: Currently, this endpoint is only working for the USD->JPY currency conversion.

```
  GET /api/v1/fx-rates
```

# Support 🤝

If you encounter any issues or have questions while setting up this application, please don't hesitate to reach out! We're here to help!

**Contact:**

- **Email:** `anmolgangwar64+forex@gmail.com`

# Happy Hacking! 🚀
