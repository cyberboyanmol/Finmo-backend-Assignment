import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { loadSwagger } from '@forexsystem/helpers/swagger/load.swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api/v1';
  app.use(helmet());
  app.use(cookieParser());
  app.setGlobalPrefix(globalPrefix);
  app.enableCors({ origin: process.env.ALLOWED_ORIGINS, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result = errors.map((error) => {
          return {
            property: error.property,
            message: error.constraints[Object.keys(error.constraints)[0]],
          };
        });
        return new BadRequestException(result);
      },
      transform: true,
      stopAtFirstError: true,
      forbidUnknownValues: false,
    })
  );

  // ✅ TODO
  // Implement a Global Response Interceptor
  loadSwagger(app);
  app.flushLogs();
  app.enableShutdownHooks();
  try {
    const port = parseInt(process.env.PORT) || 9000;
    await app.listen(port);
    Logger.log(
      `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
    );
  } catch (error) {
    Logger.warn(error);
  }
}

bootstrap();
