import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../prisma/prisma.service';
import { CreateUserDto } from '../../../dtos/auth/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(private _user: PrismaRepository<'user'>) {}

  findUserByEmail(email: string) {
    return this._user.model.user.findUnique({
      where: {
        email,
      },
    });
  }

  async createUser(body: CreateUserDto) {
    return this._user.model.user.create({
      data: {
        first_name: body.firstName,
        last_name: body.lastName,
        email: body.email,
        password: body.password,
        user_wallet: {
          create: {
            account_balance: 0,
            currency_code: 'USD',
          },
        },
      },
      select: {
        first_name: true,
        last_name: true,
        email: true,
        updated_at: true,
        created_at: true,
        user_id: true,
        is_email_verified: true,
      },
    });
  }
}
