import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({ example: 'John' })
  first_name: string;
  @ApiProperty({ example: 'Doe' })
  last_name: string;
  @ApiProperty({ example: 'john@gmail.com' })
  email: string;
  @ApiProperty({ example: '2024-04-27T21:12:56.288Z' })
  updated_at: string;
  @ApiProperty({ example: '2024-04-27T21:12:56.288Z' })
  created_at: string;
  @ApiProperty({ example: '02a182e0-8ca7-424b-8178-65352950b9a5' })
  user_id: string;
  @ApiProperty({ example: true })
  is_email_verified: false;
}

export class Tokens {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMDJhMTgyZTAtOGNhNy00MjRiLTgxNzgtNjUzNTI5NTBiOWE1IiwiaWF0IjoxNzE0MjUyMzc3LCJleHAiOjE3MTQyNTU5NzcsImF1ZCI6InVzZXJfMDJhMTgyZTAtOGNhNy00MjRiLTgxNzgtNjUzNTI5NTBiOWE1IiwiaXNzIjoiRm9yZXgtVHJhZGluZy1TeXN0ZW0iLCJzdWIiOiJhY2Nlc3NUb2tlbiJ9.DeeSKQCpmUFsuSsSj2v5xVWUh2B_1YBZgsAqFZBp0Qk',
  })
  access_token: string;
  @ApiProperty({
    example: '2024-04-27T22:12:57.212Z',
  })
  access_token_expires_at: string;
}
export class RegisterOKResponse {
  @ApiProperty()
  user: User;

  @ApiProperty()
  tokens: Tokens;
}
