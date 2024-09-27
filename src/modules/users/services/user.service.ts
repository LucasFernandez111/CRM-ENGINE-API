import { Injectable } from '@nestjs/common';
import ErrorManager from 'src/config/error.manager';
import { UserRepositoryService } from './user-repository/user-repository.service';
import { User } from 'src/schemas/users.schema';
import { CreateUserDto } from '../dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepositoryService) {}

  public async createUser(user: CreateUserDto) {
    try {
      return await this.userRepository.create(user);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) throw new ErrorManager({ type: 'NOT_FOUND', message: 'User not found for this id' });
      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findUserByTokenId(id_token: string): Promise<User> {
    try {
      const user = await this.userRepository.findUserByTokenId(id_token);
      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
  public async updateUser(id_token: string, user: any) {
    try {
      return await this.userRepository.update(id_token, user);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
