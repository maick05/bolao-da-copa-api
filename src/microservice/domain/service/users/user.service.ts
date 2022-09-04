import { NotFoundException } from '@devseeder/microservices-exceptions';
import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { Injectable } from '@nestjs/common';
import { UsersMongoose } from '../../../adapter/repository/users.repository';
import { User } from '../../schemas/users.schema';

@Injectable()
export abstract class UsersService extends AbstractService {
  constructor(protected readonly usersRepository: UsersMongoose) {
    super();
  }

  async validateUser(id: number): Promise<User> {
    const res = await this.getUserById(id);
    if (!res) throw new NotFoundException('User');

    return res;
  }

  async getUserById(id: number): Promise<User> {
    return this.usersRepository.getUserById(id);
  }
}