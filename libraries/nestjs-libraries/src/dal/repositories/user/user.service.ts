import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from '../../../dtos/auth/create-user.dto';

@Injectable()
export class UserService {
  constructor(private _userRepository: UserRepository) {}

  getUserByEmail(email: string) {
    return this._userRepository.findUserByEmail(email);
  }

  async createUser(body: CreateUserDto) {
    return this._userRepository.createUser(body);
  }
}
