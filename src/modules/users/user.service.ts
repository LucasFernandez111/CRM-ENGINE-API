import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/users.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  public async create(user: any): Promise<User> {
    return await this.userModel.create(user);
  }
  public async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }
  public async findById(id: string): Promise<User> {
    return await this.userModel.findById(id).exec();
  }
  public async update(email: string, updateUser: any): Promise<User> {
    return await this.userModel.findOneAndUpdate({ email }, updateUser).exec();
  }

  public async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  public async findUserByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email }).exec();
  }
}
