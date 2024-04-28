import { Injectable } from '@nestjs/common';
import { RefreshTokenRepository } from './refresh.repository';

@Injectable()
export class RefreshTokenService {
  constructor(private _refreshTokenService: RefreshTokenRepository) {}
  async findUserBasedOnRefreshToken(refreshToken: string): Promise<
    | ({
        user: {
          user_id: string;
          email: string;
          password: string;
          first_name: string;
          last_name: string | null;
          is_email_verified: boolean;
          created_at: Date;
          updated_at: Date;
        };
      } & { refresh_token_id: string; token: string; user_id: string })
    | null
  > {
    return this._refreshTokenService.findUserBasedOnRefreshToken(refreshToken);
  }

  async deleteAllRefreshTokenForUser(user_id: string): Promise<{
    user_id: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string | null;
    is_email_verified: boolean;
    created_at: Date;
    updated_at: Date;
  }> {
    return this._refreshTokenService.deleteAllRefreshTokenForUser(user_id);
  }
  async removeRefreshToken(
    user_id: string,
    refreshToken: string
  ): Promise<
    {
      refresh_token: {
        refresh_token_id: string;
        token: string;
        user_id: string;
      }[];
    } & {
      user_id: string;
      email: string;
      password: string;
      first_name: string;
      last_name: string | null;
      is_email_verified: boolean;
      created_at: Date;
      updated_at: Date;
    }
  > {
    return this._refreshTokenService.removeRefreshToken(user_id, refreshToken);
  }
  async addRefreshToken(
    user_id: string,
    newRefreshToken: string
  ): Promise<{ refresh_token_id: string; token: string; user_id: string }> {
    return this._refreshTokenService.addRefreshToken(user_id, newRefreshToken);
  }
}
