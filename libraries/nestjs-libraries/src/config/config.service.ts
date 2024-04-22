import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { Config, serverConfig } from '@forexsystem/helpers/interfaces';

@Injectable()
export class ConfigService implements Config {
  constructor(private readonly configService: NestConfigService) {}

  get NODE_ENV(): string {
    return this.configService.get<string>('NODE_ENV');
  }
  get SERVER(): serverConfig {
    return {
      HOST: this.configService.get<string>('HOST'),
      PORT: this.configService.get<number>('PORT'),
    };
  }
  get DATABASE_URL(): string {
    return this.configService.get<string>('DATABASE_URL');
  }
  get REDIS_URL(): string {
    return this.configService.get<string>('REDIS_URL');
  }
  get ALLOWED_ORIGINS(): string[] {
    return this.configService.get<string[]>('ALLOWED_ORIGINS');
  }

  get JWT_ACCESS_TOKEN_EXPIRATION(): string {
    return this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION');
  }

  get JWT_REFRESH_TOKEN_EXPIRATION(): string {
    return this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION');
  }

  get JWT_REFRESH_TOKEN_COOKIE_EXPIRATION(): number {
    return this.configService.get<number>(
      'JWT_REFRESH_TOKEN_COOKIE_EXPIRATION'
    );
  }
  get JWT_ACCESS_TOKEN_SECRET(): string {
    return this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET');
  }
  get JWT_REFRESH_TOKEN_SECRET(): string {
    return this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET');
  }
  get ALPHA_VANTAGE_API_KEYS(): string {
    return this.configService.get<string>('ALPHA_VANTAGE_API_KEYS');
  }
}
