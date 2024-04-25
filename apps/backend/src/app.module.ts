import { Module } from '@nestjs/common';
import { ConfigModule } from '@forexsystem/nestjs-libraries/config/config.module';
import { AuthModule } from './app/auth/auth.module';
import { DatabaseModule } from '@forexsystem/nestjs-libraries/dal/prisma/database.module';
import { UserWalletModule } from './app/user-wallet/user-walllet.module';
@Module({
  imports: [DatabaseModule, ConfigModule, AuthModule, UserWalletModule],
  controllers: [],
  providers: [],
  get exports() {
    return [...this.imports];
  },
})
export class AppModule {}
