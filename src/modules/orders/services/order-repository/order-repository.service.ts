import { Injectable } from '@nestjs/common';
import { Order } from 'src/schemas/orders.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IOrderRepository } from '../../interfaces/order-repository.interface';
import { UpdateOrderDto, CreateOrderDto } from '../../dto';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(@InjectModel(Order.name) private readonly ordersModel: Model<Order>) {}

  public async create(order: CreateOrderDto): Promise<Order> {
    return await this.ordersModel.create(order);
  }

  public async update(userId: string, order: UpdateOrderDto): Promise<Order> {
    return await this.ordersModel.findByIdAndUpdate(userId, order, { new: true }).exec();
  }

  public async delete(id: string): Promise<void> {
    await this.ordersModel.findByIdAndDelete(id).exec();
  }

  public async findById(userId: string): Promise<Order> {
    return await this.ordersModel.findById(userId).exec();
  }

  public async findAllByUserId(userId: string): Promise<Order[]> {
    return await this.ordersModel.find({ userId }).exec();
  }

  public async findAll(): Promise<Order[]> {
    return await this.ordersModel.find().exec();
  }

  public async findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Order[]> {
    return await this.ordersModel.find({
      userId,
      createdAt: { $gte: startDate, $lte: endDate },
    });
  }
}
