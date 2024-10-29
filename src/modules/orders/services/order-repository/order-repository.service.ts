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

  public async update(id: string, order: UpdateOrderDto): Promise<Order> {
    return await this.ordersModel.findByIdAndUpdate(id, order, { new: true }).exec();
  }

  public async delete(id: string): Promise<void> {
    await this.ordersModel.findByIdAndDelete(id).exec();
  }

  public async findById(id: string): Promise<Order> {
    return await this.ordersModel.findById(id).exec();
  }

  public async findAllByUserId(userId: string): Promise<Order[]> {
    return await this.ordersModel.find({ userId }).exec();
  }

  public async findAll(): Promise<Order[]> {
    return await this.ordersModel.find().exec();
  }

  public async findTopCategory() {
    return await this.ordersModel.aggregate([
      {
        $unwind: '$items',
      },
      {
        $group: {
          _id: {
            category: '$items.category',
            subcategory: '$items.subcategory',
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 1,
      },
    ]);
  }

  public async findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Order[]> {
    return await this.ordersModel.find({
      userId,
      createdAt: { $gte: startDate, $lte: endDate },
    });
  }

  public async findLastestOrder(userId: string): Promise<Order> {
    return await this.ordersModel.findOne({ userId }).sort({ createdAt: -1 }).exec();
  }
}
