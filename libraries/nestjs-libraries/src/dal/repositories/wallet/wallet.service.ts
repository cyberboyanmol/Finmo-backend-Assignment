import { Injectable } from '@nestjs/common';
import { WalletRepository } from './wallet.repository';
import { UserWallet } from '@prisma/client';
@Injectable()
export class WalletService {
  constructor(private _walletRepository: WalletRepository) {}

  async getUserWalletBalance(user_id: Pick<UserWallet, 'user_id'>) {
    return this._walletRepository.findUserWalletBalance(user_id);
  }

  async addBalancetoUserWallet(
    data: Pick<UserWallet, 'user_id' | 'account_balance'>
  ) {
    return this._walletRepository.updateUserWallet(data);
  }
}
