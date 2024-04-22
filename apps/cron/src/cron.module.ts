import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ForexSyncService } from './tasks/forex-rate-sync.task';
@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [],
  providers: [ForexSyncService],
})
export class CronModule {}
