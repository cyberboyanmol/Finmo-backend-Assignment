import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../prisma/prisma.service';

@Injectable()
export class UserWalletRepository {
  constructor(private _walletAccount: PrismaRepository<'userWallet'>) {}
}
