import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ErrorManager } from '../config/error.manager';
import { Order } from '../schemas/orders.schema';
import { ItemDto } from './dto/item.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { DateService } from 'src/date/date.service';
import { MonthlyOrders } from 'src/common/monthly-orders.interface';

@Injectable()
export class OrdersService {
  private isArrayEmpty(array: any[]): boolean {
    return array.length === 0;
  }
  constructor(
    @InjectModel(Order.name) private readonly ordersModel: Model<Order>,
    private readonly dateService: DateService,
  ) {}

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
   * @param {string | number} orderNumber - El número o ID de la orden.
   * @returns {Promise<Order>} - El pedido encontrado.
   * @throws {ErrorManager} - Si no se encuentra la orden.
   */
  public async getOrderByOrderNumber(userId: string, orderNumber: number): Promise<Order> {
    try {
      const order = await this.ordersModel.findOne({ userId, order: orderNumber });
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
   * @param {Date} startDate - La fecha de inicio en UTC.
   * @param {Date} endDate - La fecha de fin en UTC.
   * @returns {Promise<Order[]>} - Un arreglo con los pedidos en el rango de fechas.
   * @throws {ErrorManager} - Si no se encuentran pedidos.
   */
  public async getOrdersByDateRange(
    userId: string,
    startDate: Date | string,
    endDate: Date | string,
  ): Promise<Order[]> {
    try {
      const orders = await this.ordersModel.find({
        userId,
        createdAt: { $gte: startDate, $lte: endDate },
      });

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
  public async createOrder(userId: string, orderData: Order): Promise<Order> {
    try {
      const orderNumber = await this.getNextOrderNumber(userId);
      const totalAmount = this.getTotalAmountOrder(orderData);

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

  private getTotalAmountOrder = (order: Order): number => {
    return order.items.reduce((acc, item) => acc + item.price, 0);
  };

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
   * Calcula el monto total de una lista de items.
   *
   * @param {ItemDto[]} items - La lista de items.
   * @returns {number} - El monto total de los items.
   */
  public async getTotalAmount(userId: string): Promise<number> {
    const items = await this.getAllItems(userId);
    return items.reduce((acc, item) => acc + item.price, 0);
  }

  public async getAllItems(userId: string): Promise<ItemDto[]> {
    const orders = await this.getOrders(userId);
    return orders.map((order) => order.items).flat();
  }

  public async getAllPrices(userId: string): Promise<number[]> {
    const items = await this.getAllItems(userId);
    return items.map((item) => item.price);
  }

  public async getCurrentWeekOrders(userId: string) {
    const { startOfWeek, endOfWeek } = this.getDateRangeOfWeek();
    return this.getOrdersByDateRange(userId, startOfWeek, endOfWeek);
  }

  public async getOrdersByDay(userId: string) {
    const now: Date = new Date();

    const startOfTodayUTC: Date = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0),
    );

    const endOfTodayUTC: Date = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999),
    );

    return this.getOrdersByDateRange(userId, startOfTodayUTC, endOfTodayUTC);
  }

  private getDateRangeOfWeek() {
    const currentDate = new Date(); // Crea una copia de la fecha dada

    // Obtener el día de la semana (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
    const dayOfWeek = currentDate.getDay() || 7; // Si es domingo (0), se ajusta a 7 para calcular correctamente el lunes

    // Calcular el inicio de la semana (lunes)
    currentDate.setDate(currentDate.getDate() - dayOfWeek + 1);
    currentDate.setUTCHours(0, 0, 0, 0);
    const startOfWeek = new Date(currentDate);

    // Calcular el final de la semana (domingo)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setUTCHours(23, 59, 59, 999);

    return { startOfWeek, endOfWeek };
  }

  public async getMonthlyOrders(userId: string): Promise<MonthlyOrders[]> {
    const currentYear: number = new Date().getUTCFullYear();

    const firstDatesOfYear: Date[] = this.dateService.getAllFirstDatesOfMonths(currentYear);
    const lastDatesOfYear: Date[] = this.dateService.getAllLastDatesOfMonths(currentYear);

    const ordersPromises = firstDatesOfYear.map((firstDate, index) =>
      this.getOrdersByDateRange(userId, firstDate, lastDatesOfYear[index]).then((orders) => ({
        month: index + 1,
        orders,
      })),
    );

    return await Promise.all(ordersPromises);
  }
}
