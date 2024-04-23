import { Global, Module } from '@nestjs/common';
import { PrismaService, PrismaRepository } from './prisma.service';
import { UserRepository } from '../repositories/user/user.repository';
import { UserService } from '../repositories/user/user.service';
@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [PrismaRepository, PrismaService, UserRepository, UserService],
  get exports() {
    return this.providers;
  },
})
export class DatabaseModule {}
