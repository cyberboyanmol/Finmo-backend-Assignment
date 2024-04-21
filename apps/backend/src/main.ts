import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api/v1';
  app.use(helmet());
  // const configService = app.get(ConfigService);

  app.setGlobalPrefix(globalPrefix);
  // app.enableCors({ origin: configService.ALLOWED_ORIGINS, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      forbidUnknownValues: false,
    })
  );

  app.flushLogs();
  app.enableShutdownHooks();
  try {
    const port = process.env.PORT || 9000;
    await app.listen(port);
    Logger.log(
      `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
    );
  } catch (error) {
    Logger.warn(error);
  }
}

bootstrap();
