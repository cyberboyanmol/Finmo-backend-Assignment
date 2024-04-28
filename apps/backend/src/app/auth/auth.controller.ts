import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
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
} from '@nestjs/swagger';
import { RegisterOKResponse } from './swagger-responses/auth';

// ✅ TODO: Serialize the
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private _authService: AuthService,
    private _configService: ConfigService
  ) {}

  @Post('register')
  @ApiOperation({
    summary: 'Create a user',
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
    summary: 'Login with a user',
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
}
