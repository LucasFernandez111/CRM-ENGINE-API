import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Orders } from '../schemas/orders.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { format } from 'date-fns';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Orders.name) private readonly ordersModel: Model<Orders>,
  ) {}

  /**
   * Obtiene todas los pedidos de un usuario
   */
  async getOrders(id_token: string) {
    if (!id_token) throw new BadRequestException('id_token is required');
    try {
      const orders = await this.ordersModel.find({ id_token });
      return orders;
    } catch (error) {
      throw new NotFoundException(error?.message);
    }
  }

  /**
   * Obtiene un pedido de un usuario mediante el numero de orden
   */
  async getOrderById(id_token: string, order: string | number) {
    if (!id_token || !order)
      throw new BadRequestException('id_token or order is required');
    try {
      const orderFound = await this.ordersModel.findOne({ id_token, order });
      return orderFound;
    } catch (error) {
      throw new NotFoundException(error?.message);
    }
  }

  /**
   * Obtiene las ordenes de hoy de un usuario
   */
  async getTodayOrders(id_token: string) {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayOrders = await this.ordersModel.find({
      id_token,
      createdAt: { $gte: new Date(today) },
    });

    return todayOrders;
  }
  async getRecordsByDateRange(
    id_token: string,
    startDate: Date,
    endDate: Date,
  ) {
    const records = await this.ordersModel.find({
      id_token,
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });
    return records;
  }
  /**
   *  Crea un nuevo pedido
   */
  async createOrder(order: CreateOrderDto) {
    try {
      const lastOrder = await this.getLastOrder(order.id_token);

      if (!lastOrder)
        //Si no existe numero de orden se inicializa en 0
        return this.ordersModel.create({
          ...order,
          order: 1,
        });

      //Autoincrementa el numero de orden
      const orderCreated = this.ordersModel.create({
        ...order,
        order: lastOrder.order++,
      });
      return orderCreated;
    } catch (error) {
      throw new InternalServerErrorException(error?.message);
    }
  }

  async deleteOrderById(id_token: string, orderId: string) {
    try {
      const orderDeleted = await this.ordersModel.findOneAndDelete({
        id_token,
        orderId,
      });
      return orderDeleted;
    } catch (error) {
      throw new InternalServerErrorException(error?.message);
    }
  }

  /**
   * Busca el ultimo numero de orden de un usuario
   */
  private async getLastOrder(id_token: string) {
    const lastOrder = await this.ordersModel
      .findOne({ id_token })
      .sort({ order: -1 });

    return lastOrder;
  }
}
