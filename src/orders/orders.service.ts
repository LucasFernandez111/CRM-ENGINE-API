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
   * @param {string} id_token - El token de autenticacion del usuario
   * @returns {Promise<Order[]>} - Un arreglo de pedidos del usuario. Si no se encuentran pedidos, se devuelve un arreglo vacio.
   */
  public async getOrders(id_token: string): Promise<Order[]> {
    try {
      const orders = await this.ordersModel.find({ id_token });
      if (this.isArrayEmpty(orders)) {
        throw new ErrorManager({ type: 'NOT_FOUND', message: 'No orders found' });
      }
      return orders;
    } catch (error) {
      throw new ErrorManager.createSignatureError(error.message);
    }
  }

  /**
   * Obtiene un pedido de un usuario mediante el numero de orden
   *
   * @param {string} id_token - El token de autenticacion del usuario
   * @param {string | number} id - El numero de orden que se desea obtener
   * @returns {Promise<Order | []>} - El pedido encontrado. Si no se encuentra, se devuelve un array vacio.
   */
  public async getOrderById(id_token: string, id: string | number): Promise<Order | []> {
    try {
      const order: Order | [] = await this.ordersModel.findOne({ id_token, order: id });
      if (!order) throw new ErrorManager({ type: 'NOT_FOUND', message: 'No se encontro el pedido' });
      return order;
    } catch (error) {
      throw new ErrorManager.createSignatureError(error.message);
    }
  }

  public async getRecordsByDateRange(id_token: string, startDate: Date, endDate: Date): Promise<Order[] | []> {
    try {
      const records: Order[] | [] = await this.ordersModel.find({
        id_token,
        createdAt: { $gte: startDate.toUTCString(), $lte: endDate.toUTCString() },
      });

      if (this.isArrayEmpty(records)) throw new ErrorManager({ type: 'NOT_FOUND', message: 'No records found' });

      return records;
    } catch (error) {
      throw new ErrorManager.createSignatureError(error.message);
    }
  }

  /**
   * Crea un nuevo pedido
   *
   * @param {string} id_token - El token de autenticacion del usuario
   * @param {CreateOrderDto} order - El pedido a crear
   * @returns {Promise<Order>} - El pedido creado
   */
  public async createOrder(id_token: string, order: CreateOrderDto): Promise<Order> {
    try {
      // Buscamos el ultimo numero de orden del usuario
      const lastOrder: Order | null = await this.getLastOrder(id_token);

      // Si el usuario no tiene pedidos, creamos el primer pedido
      if (!lastOrder) return this.ordersModel.create({ id_token, ...order, orderNumber: 1 });

      // Si el usuario tiene pedidos, creamos un nuevo pedido con el numero de orden siguiente
      const orderCreated = this.ordersModel.create({ id_token, ...order, order: lastOrder.orderNumber + 1 });
      return orderCreated;
    } catch (error) {
      throw new ErrorManager.createSignatureError(error.message);
    }
  }

  /**
   * Elimina un pedido por su numero de orden
   *
   * @param {string} id_token - El token de autenticacion del usuario
   * @param {number} orderNumber - El numero de orden del pedido a eliminar
   * @returns {Promise<Order>} - El pedido eliminado
   */
  public async deleteOrderById(id_token: string, orderNumber: number): Promise<Order> {
    try {
      const orderDeleted: Order = await this.ordersModel.findOneAndDelete({ id_token, orderNumber });

      if (!orderDeleted) throw new ErrorManager({ type: 'NOT_FOUND', message: 'Order not found' });

      return orderDeleted;
    } catch (error) {
      throw new ErrorManager.createSignatureError(error.message);
    }
  }

  /**
   * Busca el ultimo pedido de un usuario por su token de autenticacion
   *
   * @param {string} id_token - El token de autenticacion del usuario
   * @returns {Promise<Order | null>} - El pedido encontrado. Si no hay pedidos, se devuelve null.
   */
  private async getLastOrder(id_token: string): Promise<Order | null> {
    // Buscamos el ultimo pedido de un usuario por su token de autenticacion
    // Ordenamos por el numero de orden en orden descendiente (mas reciente arriba)
    return await this.ordersModel.findOne({ id_token }).sort({ orderNumber: -1 });
  }
}
