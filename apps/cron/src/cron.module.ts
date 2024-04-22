import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ForexSyncService } from './tasks/forex-rate-sync.task';
import { ConfigModule } from '@forexsystem/nestjs-libraries/config/config.module';
@Module({
  imports: [ScheduleModule.forRoot(), ConfigModule],
  controllers: [],
  providers: [ForexSyncService],
})
export class CronModule {}
