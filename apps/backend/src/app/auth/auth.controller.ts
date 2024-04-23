import { Body, Controller, Post, Req, Res } from '@nestjs/common';

import { Request, Response } from 'express';
import { CreateUserDto } from '@forexsystem/nestjs-libraries/dtos/auth/create-user.dto';
import { AuthService } from './auth.service';
import { ConfigService } from '@forexsystem/nestjs-libraries/config/config.service';

@Controller('auth')
export class AuthController {
  constructor(
    private _authService: AuthService,
    private _configService: ConfigService
  ) {}

  @Post('register')
  async register(
    @Req() req: Request,
    @Body() body: CreateUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    try {
      const {
        user,
        tokens: {
          access_token,
          refresh_token,
          access_token_expires_at,
          refresh_token_expires_at,
        },
      } = await this._authService.registerUser(body);

      res.cookie('refresh_token', refresh_token, {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
        maxAge: this._configService.JWT_REFRESH_TOKEN_COOKIE_EXPIRATION,
      });

      res.cookie('refresh_token_expires_at', refresh_token_expires_at, {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
        maxAge: this._configService.JWT_REFRESH_TOKEN_COOKIE_EXPIRATION,
      });

      // ✅ TODO: send the account verification mail..
      // asynchronous operation
      return {
        user,
        tokens: {
          access_token,
          access_token_expires_at,
        },
      };
    } catch (e) {
      return e.message;
    }
  }

  @Post('login')
  async login(
    @Req() req: Request,
    @Body() body: Pick<CreateUserDto, 'email' | 'password'>,
    @Res({ passthrough: true }) res: Response
  ) {
    try {
      const {
        user,
        tokens: {
          access_token,
          refresh_token,
          access_token_expires_at,
          refresh_token_expires_at,
        },
      } = await this._authService.loginUser(body);

      res.cookie('refresh_token', refresh_token, {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
        maxAge: this._configService.JWT_REFRESH_TOKEN_COOKIE_EXPIRATION,
      });

      res.cookie('refresh_token_expires_at', refresh_token_expires_at, {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
        maxAge: this._configService.JWT_REFRESH_TOKEN_COOKIE_EXPIRATION,
      });

      return {
        user,
        tokens: {
          access_token,
          access_token_expires_at,
        },
      };
    } catch (e) {
      return e.message;
    }
  }
}
