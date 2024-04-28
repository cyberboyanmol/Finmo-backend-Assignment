import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../prisma/prisma.service';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    private _refreshToken: PrismaRepository<'refreshToken'>,
    private _user: PrismaRepository<'user'>
  ) {}

  async findUserBasedOnRefreshToken(refreshToken: string) {
    return this._refreshToken.model.refreshToken.findUnique({
      where: {
        token: refreshToken,
      },
      include: {
        user: true,
      },
    });
  }

  async deleteAllRefreshTokenForUser(user_id: string) {
    return this._user.model.user.update({
      where: {
        user_id,
      },
      data: {
        refresh_token: {
          deleteMany: {
            user_id,
          },
        },
      },
    });
  }

  async removeRefreshToken(user_id: string, refreshToken: string) {
    return this._user.model.user.update({
      where: {
        user_id,
      },
      data: {
        refresh_token: {
          delete: {
            token: refreshToken,
          },
        },
      },
      include: {
        refresh_token: true,
      },
    });
  }

  async addRefreshToken(user_id: string, newRefreshToken: string) {
    return this._refreshToken.model.refreshToken.create({
      data: {
        token: newRefreshToken,
        user: {
          connect: {
            user_id,
          },
        },
      },
    });
  }
}
