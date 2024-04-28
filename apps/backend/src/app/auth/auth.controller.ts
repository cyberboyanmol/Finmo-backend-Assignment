import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';

import { Request, Response } from 'express';
import { CreateUserDto } from '@forexsystem/nestjs-libraries/dtos/auth/create-user.dto';
import { LoginDto } from '@forexsystem/nestjs-libraries/dtos/auth/login-user.dto';
import { AuthService } from './auth.service';
import { ConfigService } from '@forexsystem/nestjs-libraries/config/config.service';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RefreshResponse, RegisterOKResponse } from './swagger-responses/auth';
import { RefreshTokenService } from '@forexsystem/nestjs-libraries/dal/repositories/refresh/refresh.service';
import { CryptoService } from '@forexsystem/helpers/auth/crypto.service';

// ✅ TODO: Serialize the
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private _authService: AuthService,
    private _configService: ConfigService,
    private _refreshTokenService: RefreshTokenService
  ) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register User',
  })
  @ApiCreatedResponse({
    description: 'User has been successfully created',
    type: RegisterOKResponse,
  })
  @ApiBadRequestResponse({
    description: 'Some character error or type error',
  })
  @ApiConflictResponse({
    description: 'User already exists',
  })
  async register(
    @Req() req: Request,
    @Body() body: CreateUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const {
      user,
      tokens: {
        access_token,
        refresh_token,
        access_token_expires_at,
        refresh_token_expires_at,
      },
    } = await this._authService.registerUser(body);
    await this._refreshTokenService.addRefreshToken(
      user.user_id,
      refresh_token
    );
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
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login User',
  })
  @ApiOkResponse({
    description: 'User has been successfully logged in',
    type: RegisterOKResponse,
  })
  @ApiBadRequestResponse({
    description: 'Some character error or type error',
  })
  @ApiForbiddenResponse({
    description: 'Email or password incorrect',
  })
  async login(
    @Req() req: Request,
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const {
      user,
      tokens: {
        access_token,
        refresh_token,
        access_token_expires_at,
        refresh_token_expires_at,
      },
    } = await this._authService.loginUser(body);
    await this._refreshTokenService.addRefreshToken(
      user.user_id,
      refresh_token
    );
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
  }

  @Get('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh Token',
    description: `The Refresh Access Token API is responsible for refreshing the access token when it expires.
      It allows you to make a request to this endpoint with the refresh token, which has a lengthy expiry time, to obtain a new access token.
      `,
  })
  @ApiOkResponse({
    description: 'User has been successfully logged in',
    type: RefreshResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid User',
  })
  @ApiForbiddenResponse({
    description:
      'JWT cookie is missing or Invalid | Invalid refresh token: Token reuse detected',
  })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const cookie = req.cookies;
    if (!cookie.refresh_token) {
      throw new UnauthorizedException('JWT cookie is missing or Invalid !');
    }

    const refreshToken = cookie.refresh_token;
    res.clearCookie('refresh_token', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    res.clearCookie('refresh_token_expires_at', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    // fetch user  based on refresh token
    const user = await this._refreshTokenService.findUserBasedOnRefreshToken(
      refreshToken
    );
    // if user not found
    if (!user) {
      // means refresh token resuse

      const { user_id } = CryptoService.verifyRefreshToken(refreshToken);

      //remove all the refresh token from refresh model belong to hackedUser
      await this._refreshTokenService.deleteAllRefreshTokenForUser(user_id);

      throw new ForbiddenException(
        'Invalid refresh token: Token reuse detected'
      );
    }
    const { user_id } = CryptoService.verifyRefreshToken(refreshToken);

    if (user_id !== user.user_id) {
      throw new UnauthorizedException('Invalid user!');
    }

    await this._refreshTokenService.removeRefreshToken(
      user.user_id,
      refreshToken
    );

    const {
      access_token,
      refresh_token: newRefreshToken,
      refresh_token_expires_at,
      access_token_expires_at,
    } = this._authService.getTokens({ user_id: user.user_id });

    await this._refreshTokenService.addRefreshToken(
      user.user_id,
      newRefreshToken
    );

    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: true,
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
      access_token,
      refreshToken: newRefreshToken,
      refresh_token_expires_at,
      access_token_expires_at,
    };
  }
}
