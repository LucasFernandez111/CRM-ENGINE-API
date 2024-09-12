import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { ErrorManager } from 'src/config/error.manager';
import { Order } from 'src/schemas/orders.schema';

@Injectable()
export class OrdersService {
  private isArrayEmpty(array: any[]) {
    return array.length === 0;
  }
  constructor(@InjectModel(Order.name) private readonly ordersModel: Model<Order>) {}

  /**
   * Obtiene todos los pedidos de un usuario
   *
   * @param {string} userId - El token de autenticacion del usuario
   * @returns {Promise<Order[]>} - Un arreglo de pedidos del usuario. Si no se encuentran pedidos, se devuelve un arreglo vacio.
   */
  public async getOrders(userId: string): Promise<Order[]> {
    try {
      const orders = await this.ordersModel.find({ userId });
      if (this.isArrayEmpty(orders)) {
        throw new ErrorManager({ type: 'NOT_FOUND', message: 'No orders found' });
      }
      return orders;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /**
   * Obtiene un pedido de un usuario mediante el numero de orden
   *
   * @param {string} userId - El token de autenticacion del usuario
   * @param {string | number} id - El numero de orden que se desea obtener
   * @returns {Promise<Order | []>} - El pedido encontrado. Si no se encuentra, se devuelve un array vacio.
   */
  public async getOrderById(userId: string, id: string | number): Promise<Order | []> {
    try {
      const order: Order | [] = await this.ordersModel.findOne({ userId, order: id });
      if (!order) throw new ErrorManager({ type: 'NOT_FOUND', message: 'No se encontro el pedido' });
      return order;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async getRecordsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Order[] | []> {
    try {
      const records: Order[] | [] = await this.ordersModel.find({
        userId,
        createdAt: { $gte: startDate.toUTCString(), $lte: endDate.toUTCString() },
      });

      if (this.isArrayEmpty(records)) throw new ErrorManager({ type: 'NOT_FOUND', message: 'No records found' });

      return records;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /**
   * Crea un nuevo pedido
   *
   * @param {string} userId - El token de autenticacion del usuario
   * @param {CreateOrderDto} order - El pedido a crear
   * @returns {Promise<Order>} - El pedido creado
   */
  public async createOrder(userId: string, order: CreateOrderDto): Promise<Order> {
    try {
      // Buscamos el ultimo numero de orden del usuario
      const lastOrder: Order | null = await this.getLastOrder(userId);

      // Si el usuario no tiene pedidos, creamos el primer pedido
      if (!lastOrder) return this.ordersModel.create({ userId, ...order, orderNumber: 1 });

      // Si el usuario tiene pedidos, creamos un nuevo pedido con el numero de orden siguiente
      const orderCreated = this.ordersModel.create({ userId, ...order, orderNumber: lastOrder.orderNumber + 1 });
      return orderCreated;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /**
   * Elimina un pedido por su numero de orden
   *
   * @param {string} userId - El token de autenticacion del usuario
   * @param {number} orderNumber - El numero de orden del pedido a eliminar
   * @returns {Promise<Order>} - El pedido eliminado
   */
  public async deleteOrderById(userId: string, orderNumber: number): Promise<Order> {
    try {
      const orderDeleted: Order = await this.ordersModel.findOneAndDelete({ userId, orderNumber });

      if (!orderDeleted) throw new ErrorManager({ type: 'NOT_FOUND', message: 'Order not found' });

      return orderDeleted;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /**
   * Busca el ultimo pedido de un usuario por su token de autenticacion
   *
   * @param {string} userId - El token de autenticacion del usuario
   * @returns {Promise<Order | null>} - El pedido encontrado. Si no hay pedidos, se devuelve null.
   */
  private async getLastOrder(userId: string): Promise<Order | null> {
    // Buscamos el ultimo pedido de un usuario por su token de autenticacion
    // Ordenamos por el numero de orden en orden descendiente (mas reciente arriba)
    return await this.ordersModel.findOne({ userId }).sort({ orderNumber: -1 });
  }
}
