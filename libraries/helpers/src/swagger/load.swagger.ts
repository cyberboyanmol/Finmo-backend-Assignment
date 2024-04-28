import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export const loadSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Forex-trading-system Assignment')
    .setDescription(
      `This is Implementation of Forex Trading backend system using Nestjs.

       Key Features:

        1.Live FX Exchange Rates: Stay ahead of the market with live foreign     exchange rates that are updated every 30 seconds, 
         ensuring you have access to the most up-to-date pricing information for informed trading decisions.

        2.Secure Authentication and Authorization: Robust authentication and authorization mechanisms are in place, employing industry-standard access and refresh token protocols.
          This ensures that your trading activities and sensitive data remain secure and accessible only to authorized users.

        3.User Wallet Management: Users can easily topup their wallet account and check the balances in nearly all currencies.

        4.Real-Time Currency Conversions: Leveraging the live exchange rates, users can convert amounts between different currencies with precision and accuracy.

        ## 🏁 Installation

        Follow [these](https://github.com/cyberboyanmol/) instructions for the installation and project setup.
        `
    )
    .addBearerAuth(
      { type: 'http', scheme: 'Bearer', bearerFormat: 'JWT' },
      'JWT'
    )
    .addServer('http://localhost:9000', 'development')
    .addServer('https://forex-trading-system.com', 'Production')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/v1/docs', app, document);
};
