import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { BullMqServer } from '@forexsystem/nestjs-libraries/bull-mq-transport/server/bull-mq.server';
import { Logger } from '@nestjs/common';
async function bootstrap() {
  const load = await NestFactory.create(WorkerModule);
  const strategy = load.get(BullMqServer);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    WorkerModule,
    {
      strategy,
    }
  );

  Logger.log('Workers Application started 🚀.');
  await app.listen();
}

bootstrap();
