import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../prisma/prisma.service';
import { UserWallet } from '@prisma/client';
@Injectable()
export class WalletRepository {
  constructor(private _walletAccount: PrismaRepository<'userWallet'>) {}
  async getUserWalletBalance(data: Pick<UserWallet, 'user_id'>) {
    return this._walletAccount.model.userWallet.findUnique({
      where: {
        user_id: data.user_id,
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

  async addBalancetoUserWallet(
    data: Pick<UserWallet, 'user_id' | 'account_balance'>
  ) {
    return this._walletAccount.model.userWallet.update({
      where: {
        user_id: data.user_id,
      },
      data: {
        account_balance: data.account_balance,
      },
    });
  }
}
