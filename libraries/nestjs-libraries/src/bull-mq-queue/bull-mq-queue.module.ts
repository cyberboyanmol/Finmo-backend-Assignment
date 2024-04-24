import {
  ConfigurableModuleBuilder,
  DynamicModule,
  Module,
} from '@nestjs/common';

import { BullModule } from '@nestjs/bullmq';
import {
  ConfigurableModuleClass,
  OPTIONS_TYPE,
} from './bull-mq-queue.module-defination';

@Module({})
export class QueueModule extends ConfigurableModuleClass {
  static register(options: typeof OPTIONS_TYPE): DynamicModule {
    // const bullBoardModules = options.queues.map((name) =>
    //   BullBoardModule.forFeature({
    //     name,
    //     adapter: BullMQAdapter,
    //   })
    // );

    const bullModules = options.queues.map((name) =>
      BullModule.registerQueue({ name })
    );

    // const flowProducers = (options.flows || []).map((flow) =>
    //   BullModule.registerFlowProducer({
    //     name: flow,
    //   })
    // );

    return {
      ...super.register(options),
      imports: [...bullModules],
      exports: [...bullModules],
    };
  }
}
