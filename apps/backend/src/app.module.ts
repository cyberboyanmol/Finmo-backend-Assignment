import { Module } from '@nestjs/common';
import { ConfigModule } from '@forexsystem/nestjs-libraries/config/config.module';
import { AuthModule } from './app/auth/auth.module';
import { DatabaseModule } from '@forexsystem/nestjs-libraries/dal/prisma/database.module';
@Module({
  imports: [DatabaseModule, ConfigModule, AuthModule],
  controllers: [],
  providers: [],
  get exports() {
    return [...this.imports];
  },
})
export class AppModule {}
