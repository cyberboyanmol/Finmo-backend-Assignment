import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../prisma/prisma.service';

@Injectable()
export class UserWalletRepository {
  constructor(private _walletAccount: PrismaRepository<'userWallet'>) {}
  async getUserWalletBalance(user_id: string) {
    return this._walletAccount.model.userWallet.findUnique({
      where: {
        user_id,
      },
      select: {
        user_id: true,
        account_balance: true,
        currency_code: true,
        user: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
    });
  }

  async addBalancetoUserWallet(data: {
    user_id: string;
    total_amount: number;
  }) {
    return this._walletAccount.model.userWallet.update({
      where: {
        user_id: data.user_id,
      },
      data: {
        account_balance: data.total_amount,
      },
    });
  }
}
