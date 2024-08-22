import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from 'src/schemas/users.schema';

@Injectable()
export class UsersDbService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<Users>,
  ) {}

  async createUser(user: Users): Promise<Users> {
    try {
      return await this.userModel.create(user);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error creating user',
        error: error.message,
      });
    }
  }
}
