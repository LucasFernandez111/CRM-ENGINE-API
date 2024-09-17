import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../../common/dto/create-user.dto';
import { Users } from '../../schemas/users.schema';
import { UpdateUserDto } from '../../modules/users/dto/update-user.dto';

@Injectable()
export class DatabaseUsersService {
  constructor(@InjectModel('Users') private readonly userModel: Model<Users>) {}

  async createUser(user: CreateUserDto): Promise<Users> {
    try {
      const userCreated = await this.userModel.create(user);
      return userCreated;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error creating user',
        error: error.message,
      });
    }
  }

  async getUser(id_token: string) {
    if (!id_token) throw new BadRequestException('id_token is required');
    try {
      const user = await this.userModel.findOne({ id_token });
      return user;
    } catch (error) {
      throw new NotFoundException(error?.message);
    }
  }

  async updateUser(id_token: string, userData: UpdateUserDto) {
    if (!id_token) throw new BadRequestException('id_token is required');
    try {
      const user = await this.userModel.findOneAndUpdate({ id_token }, userData);
      return user;
    } catch (error) {
      throw new NotFoundException(error?.message);
    }
  }
}
