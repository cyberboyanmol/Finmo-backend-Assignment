import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { LoginDto } from './login-user.dto';
export class CreateUserDto extends LoginDto {
  @ApiProperty({
    example: 'John',
    description: 'The first name of the user (min length: 3)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  readonly firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user (optional)',
  })
  @IsString()
  @IsOptional()
  readonly lastName: string;
}
