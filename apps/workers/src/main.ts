import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  await NestFactory.createApplicationContext(WorkerModule);
  Logger.log('Workers Application started 🚀.');
}

bootstrap();
