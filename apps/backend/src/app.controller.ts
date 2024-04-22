import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { ConfigService } from '@forexsystem/nestjs-libraries/config/config.service';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService
  ) {}

  @Get()
  getData() {
    console.log(this.configService.DATABASE_URL);
    return this.appService.getData();
  }
}
