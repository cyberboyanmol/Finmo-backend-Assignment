import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ForexSyncService {
  @Cron(CronExpression.EVERY_HOUR)
  async syncForexRates() {
    console.log(' ForexSyncService run every hour');
  }
  @Cron(CronExpression.EVERY_MINUTE)
  handleEvery10Minutes() {
    console.log('Task executed every minutes');
  }
}
