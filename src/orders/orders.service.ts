import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ErrorManager } from 'src/config/error.manager';
import { Order } from 'src/schemas/orders.schema';
import { ItemDto } from './dto/item.dto';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private readonly ordersModel: Model<Order>) {}

  /**
   * Obtiene todos los pedidos de un usuario.
   *
   * @param {string} userId - El ID del usuario.
   * @returns {Promise<Order[]>} - Un arreglo con los pedidos del usuario.
   * @throws {ErrorManager} - Si no se encuentran pedidos.
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
   * Obtiene un pedido por su número de orden.
   *
   * @param {string} userId - El ID del usuario.
   * @param {string | number} orderId - El número o ID de la orden.
   * @returns {Promise<Order>} - El pedido encontrado.
   * @throws {ErrorManager} - Si no se encuentra la orden.
   */
  public async getOrderById(userId: string, orderId: string | number): Promise<Order> {
    try {
      const order = await this.ordersModel.findOne({ userId, order: orderId });
      if (!order) {
        throw new ErrorManager({ type: 'NOT_FOUND', message: 'Order not found' });
      }
      return order;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /**
   * Obtiene pedidos en un rango de fechas.
   *
   * @param {string} userId - El ID del usuario.
   * @param {Date} startDate - La fecha de inicio.
   * @param {Date} endDate - La fecha de fin.
   * @returns {Promise<Order[]>} - Un arreglo con los pedidos en el rango de fechas.
   * @throws {ErrorManager} - Si no se encuentran pedidos.
   */
  public async getOrdersByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Order[]> {
    try {
      const orders = await this.ordersModel.find({
        userId,
        createdAt: { $gte: startDate.toUTCString(), $lte: endDate.toUTCString() },
      });
      if (this.isArrayEmpty(orders)) {
        throw new ErrorManager({ type: 'NOT_FOUND', message: 'No records found' });
      }
      return orders;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /**
   * Crea un nuevo pedido.
   *
   * @param {string} userId - El ID del usuario.
   * @param {CreateOrderDto} orderData - Los datos del nuevo pedido.
   * @returns {Promise<Order>} - El pedido creado.
   */
  public async createOrder(userId: string, orderData: CreateOrderDto): Promise<Order> {
    try {
      const totalAmount = this.getTotalAmount(orderData.items);
      const orderNumber = await this.getNextOrderNumber(userId);

      const newOrder = {
        userId,
        ...orderData,
        orderNumber,
        totalAmount,
      };

      return this.ordersModel.create(newOrder);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /**
   * Elimina un pedido por su número de orden.
   *
   * @param {string} userId - El ID del usuario.
   * @param {number} orderNumber - El número de la orden a eliminar.
   * @returns {Promise<Order>} - El pedido eliminado.
   * @throws {ErrorManager} - Si no se encuentra el pedido a eliminar.
   */
  public async deleteOrderById(userId: string, orderNumber: number): Promise<Order> {
    try {
      const deletedOrder = await this.ordersModel.findOneAndDelete({ userId, orderNumber });
      if (!deletedOrder) {
        throw new ErrorManager({ type: 'NOT_FOUND', message: 'Order not found' });
      }
      return deletedOrder;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /**
   * Obtiene el siguiente número de pedido.
   *
   * @param {string} userId - El ID del usuario.
   * @returns {Promise<number>} - El siguiente número de pedido.
   */
  private async getNextOrderNumber(userId: string): Promise<number> {
    const lastOrder = await this.getLastOrder(userId);
    return lastOrder ? lastOrder.orderNumber + 1 : 1;
  }

  /**
   * Obtiene el último pedido de un usuario.
   *
   * @param {string} userId - El ID del usuario.
   * @returns {Promise<Order | null>} - El último pedido del usuario.
   */
  private async getLastOrder(userId: string): Promise<Order | null> {
    return this.ordersModel.findOne({ userId }).sort({ orderNumber: -1 });
  }

  /**
   * Verifica si un arreglo está vacío.
   *
   * @param {any[]} array - El arreglo a verificar.
   * @returns {boolean} - `true` si el arreglo está vacío, de lo contrario `false`.
   */
  private isArrayEmpty(array: any[]): boolean {
    return array.length === 0;
  }

  /**
   * Calcula el monto total de una lista de items.
   *
   * @param {ItemDto[]} items - La lista de items.
   * @returns {number} - El monto total de los items.
   */
  private getTotalAmount(items: ItemDto[]): number {
    return items.reduce((acc, item) => acc + item.price, 0);
  }

  
}
