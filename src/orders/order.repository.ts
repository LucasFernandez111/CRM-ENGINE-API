import { Injectable } from '@nestjs/common';
import { Order } from 'src/schemas/orders.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ErrorManager } from 'src/config/error.manager';
import { IOrderRepository } from './interfaces/order-repository.interface';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(@InjectModel(Order.name) private readonly ordersModel: Model<Order>) {}

  public async create(order: Order): Promise<Order> {
    try {
      return await this.ordersModel.create(order);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async update(userId: string, Order: Partial<Order>): Promise<Order> {
    try {
      return await this.ordersModel.findByIdAndUpdate(userId, Order, { new: true }).exec();
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async delete(userId: string): Promise<void> {
    try {
      await this.ordersModel.findByIdAndDelete(userId).exec();
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findById(userId: string): Promise<Order> {
    try {
      return await this.ordersModel.findById(userId).exec();
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findAllByUserId(userId: string): Promise<Order[]> {
    try {
      return await this.ordersModel.find({ userId }).exec();
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findAll(): Promise<Order[]> {
    try {
      return await this.ordersModel.find().exec();
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
