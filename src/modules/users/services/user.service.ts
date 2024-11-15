import { Injectable } from '@nestjs/common';
import ErrorManager from 'src/config/error.manager';
import { UserRepositoryService } from './user-repository/user-repository.service';
import { User } from 'src/schemas/users.schema';
import { CreateUserDto, UpdateUserDTO } from '../dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepositoryService) {}

  public async createUser(user: CreateUserDto): Promise<User | null> {
    try {
      const foundUser = await this.userRepository.findUserByTokenId(user.id_token);
      return !foundUser ? await this.userRepository.create(user) : null;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /**
   *
   * @param id _id de usuario en la base de datos
   * @returns {User} usuario
   */

  public async findById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) throw new ErrorManager({ type: 'NOT_FOUND', message: 'User not found for this id' });
      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /**
   *
   * @param idToken Id usuario proporcionado por oauth
   * @returns {User} usuario
   */
  public async findUserByTokenId(idToken: string): Promise<User> {
    try {
      return await this.userRepository.findUserByTokenId(idToken);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /**
   * @param idToken Id usuario proporcionado por oauth
   * @param updateUser datos a actualizar
   * @returns {User} usuario acutalizado
   */
  public async updateUser(idToken: string, updateUser: UpdateUserDTO): Promise<User> {
    try {
      const user = await this.userRepository.update(idToken, updateUser);
      console.log({ user });
      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
