import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export const loadSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Forex-trading-system swagger file')
    .setDescription('API description')
    .setVersion('1.0')
    .build();

  console.log('this is swagger file');
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/v1/docs', app, document);
};
