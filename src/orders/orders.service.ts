import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Orders } from 'src/schemas/orders.schema';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Orders.name) private readonly ordersModel: Model<Orders>,
  ) {}

  async getOrders(id_token: string) {
    if (!id_token) throw new BadRequestException('id_token is required');
    try {
      const orders = await this.ordersModel.find({ id_token });
      return orders;
    } catch (error) {
      throw new NotFoundException(error?.message);
    }
  }

  async getOrder(id_token: string, order: string) {
    if (!id_token || !order)
      throw new BadRequestException('id_token or order is required');
    try {
      const orderFound = await this.ordersModel.findOne({ id_token, order });
      return orderFound;
    } catch (error) {
      throw new NotFoundException(error?.message);
    }
  }

  async createOrder(order: CreateOrderDto) {
    try {
      const lastOrder = await this.findLastOrder(order.id_token);

      if (!lastOrder)
        //Si no existe numero de orden inicializa en 0
        return this.ordersModel.create({
          ...order,
          order: 1,
        });

      //Auto incrementa el numero de orden
      const orderCreated = this.ordersModel.create({
        ...order,
        order: lastOrder.order + 1,
      });
      return orderCreated;
    } catch (error) {
      throw new InternalServerErrorException(error?.message);
    }
  }

  async deleteOrder(id_token: string, order: string) {
    try {
      const orderDeleted = await this.ordersModel.findOneAndDelete({
        id_token,
        order,
      });
      return orderDeleted;
    } catch (error) {
      throw new InternalServerErrorException(error?.message);
    }
  }

  private async findLastOrder(id_token: string) {
    //Busca el ultimo numero de orden por el id_token y ultimo numero de orden
    const lastOrder = await this.ordersModel
      .findOne({ id_token })
      .sort({ order: -1 });

    return lastOrder;
  }
}
