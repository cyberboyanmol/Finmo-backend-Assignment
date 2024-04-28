import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'john@gmail.com',
    description: 'The email address of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user (min length: 8)',
  })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  readonly password: string;
}
