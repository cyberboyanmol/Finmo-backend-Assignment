import { ConfigurableModuleBuilder } from '@nestjs/common';
import { QueueBoardModuleOptions } from './interfaces/bull-mq-queue.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, OPTIONS_TYPE } =
  new ConfigurableModuleBuilder<QueueBoardModuleOptions>().build();
