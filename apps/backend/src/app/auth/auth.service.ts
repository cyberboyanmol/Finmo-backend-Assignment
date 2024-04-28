import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserService } from '@forexsystem/nestjs-libraries/dal/repositories/user/user.service';
import { CreateUserDto } from '@forexsystem/nestjs-libraries/dtos/auth/create-user.dto';
import { CryptoService } from '@forexsystem/helpers/auth/crypto.service';
import { ConfigService } from '@forexsystem/nestjs-libraries/config/config.service';
import { LoginDto } from '@forexsystem/nestjs-libraries/dtos/auth/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly _userService: UserService,
    private _configService: ConfigService
  ) {}

  async registerUser(body: CreateUserDto) {
    // check if user already exists
    const isUserExists = await this._userService.getUserByEmail(body.email);

    if (isUserExists) {
      throw new ConflictException(`User already exists`);
    }
    const hashPassword = await CryptoService.generatehashPassword(
      body.password
    );

    const user = await this._userService.createUser({
      ...body,
      password: hashPassword,
    });

    const {
      access_token,
      refresh_token,
      access_token_expires_at,
      refresh_token_expires_at,
    } = await this.getTokens({
      user_id: user.user_id,
    });

    return {
      user,
      tokens: {
        access_token,
        access_token_expires_at,
        refresh_token,
        refresh_token_expires_at,
      },
    };
  }

  async loginUser(body: LoginDto) {
    // check if the user exists
    const user = await this._userService.getUserByEmail(body.email);

    if (!user) {
      throw new ForbiddenException('Invalid Credentials.');
    }

    const isPasswordMatch = await CryptoService.comparePassword(
      body.password,
      user.password
    );

    // verifying the password store in db
    if (!isPasswordMatch) {
      throw new ForbiddenException('Invalid Credentials.');
    }
    const {
      access_token,
      refresh_token,
      access_token_expires_at,
      refresh_token_expires_at,
    } = await this.getTokens({
      user_id: user.user_id,
    });

    delete user.password;
    return {
      user,
      tokens: {
        access_token,
        access_token_expires_at,
        refresh_token,
        refresh_token_expires_at,
      },
    };
  }

  getTokens(payload: { user_id: string }) {
    const access_token = CryptoService.generateAccessToken(payload);
    const refresh_token = CryptoService.generateRefreshToken(payload);

    const refresh_token_expiration =
      this._configService.JWT_REFRESH_TOKEN_COOKIE_EXPIRATION;
    const acess_token_expiration =
      this._configService.JWT_ACESS_TOKEN_COOKIE_EXPIRATION;

    const access_token_expires_at = new Date(
      Date.now() + Number(acess_token_expiration)
    );
    const refresh_token_expires_at = new Date(
      Date.now() + Number(refresh_token_expiration)
    );
    return {
      access_token,
      access_token_expires_at,
      refresh_token,
      refresh_token_expires_at,
    };
  }
}
