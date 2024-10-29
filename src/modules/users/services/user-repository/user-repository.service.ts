import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IRepository } from 'src/common/interfaces/repository.interface';
import { User } from 'src/schemas/users.schema';

@Injectable()
export class UserRepositoryService implements IRepository<User> {
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
  public async update(_id: string, user: any): Promise<User> {
    return await this.userModel.findByIdAndUpdate(_id, user, { new: true }).exec();
  }

  public async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  public async findUserByTokenId(id_token: string): Promise<User> {
    return await this.userModel.findOne({ id_token }).exec();
  }
}
