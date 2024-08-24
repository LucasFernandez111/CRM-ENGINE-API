import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Orders } from 'src/schemas/orders.schema';
import { CreateOrderDto } from './dto/create-order.dto';
@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Orders.name) private readonly ordersModel: Model<Orders>,
  ) {}

  async createOrder(order: CreateOrderDto) {
    try {
      console.log(order);

      const orderCreated = this.ordersModel.create(order);
      return orderCreated;
    } catch (error) {
      throw new InternalServerErrorException(error?.message);
    }
  }
}
