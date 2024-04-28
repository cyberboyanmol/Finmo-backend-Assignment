import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export const loadSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Forex-trading-system Assignment swagger file')
    .setDescription(``)
    .addBearerAuth({
      bearerFormat: '<Bearer token>',
      type: 'apiKey',
    })
    .addServer('http://localhost:9000', 'Local environment')
    .addServer('https://forex-trading-system.com', 'Production')
    .setVersion('1.0')
    .build();

  console.log('this is swagger file');
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/v1/docs', app, document);
};
