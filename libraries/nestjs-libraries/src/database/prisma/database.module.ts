import { Global, Module } from '@nestjs/common';
import { PrismaService, PrismaRepository } from './prisma.service';
@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [PrismaRepository, PrismaService],
  get exports() {
    return this.providers;
  },
})
export class DatabaseModule {}
