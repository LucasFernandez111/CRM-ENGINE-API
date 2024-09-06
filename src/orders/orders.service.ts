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

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Orders.name) private readonly ordersModel: Model<Orders>,
  ) {}

  /**
   * Obtiene todas los pedidos de un usuario
   */
  async getOrders(id_token: string) {
    try {
      const orders = await this.ordersModel.find({ id_token });
      if (orders.length === 0)
        throw new NotFoundException('No orders found for this user');
      return orders;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error?.message);
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

  async getRecordsByDateRange(
    id_token: string,
    startDate: Date,
    endDate: Date,
  ) {
    // Filtrar registros por id_token y por el rango de fechas
    const records = await this.ordersModel.find({
      id_token,
      createdAt: { $gte: startDate.toUTCString(), $lte: endDate.toUTCString() },
    });

    return records;
  }

  /**
   *  Crea un nuevo pedido
   */
  async createOrder(id_token: string, order: CreateOrderDto) {
    try {
      const lastOrder = await this.getLastOrder(id_token);

      if (!lastOrder)
        //Si no existe numero de orden se inicializa en 0
        return this.ordersModel.create({
          id_token,
          ...order,
          order: 1,
        });

      //Autoincrementa el numero de orden
      const orderCreated = this.ordersModel.create({
        id_token,
        ...order,
        order: lastOrder.order + 1,
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
