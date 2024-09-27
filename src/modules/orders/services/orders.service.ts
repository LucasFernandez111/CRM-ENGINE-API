import { Injectable } from '@nestjs/common';
import ErrorManager from 'src/config/error.manager';
import { Order } from 'src/schemas/orders.schema';
import { OrderRepository } from './order-repository/order-repository.service';
import { CreateOrderDto, UpdateOrderDto } from '../dto';
import { DateFilterService } from './date-filter/date-filter.service';

@Injectable()
export class OrdersService {
  private isOrdenEmpty(orders: Order[]): boolean {
    return orders.length === 0 || orders === null;
  }

  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly dateFilterService: DateFilterService,
  ) {}
  public async createOrder(userId: string, order: CreateOrderDto): Promise<Order> {
    try {
      const orders = await this.getLastOrder(userId);
      const totalAmount = this.calculateTotalAmount(orders);
      const orderNumber = orders ? orders.orderNumber + 1 : 1;

      const updatedOrder = { userId, orderNumber, totalAmount, ...order };

      return await this.orderRepository.create(updatedOrder);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async deleteOrder(id: string): Promise<void> {
    try {
      await this.orderRepository.delete(id);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async updateOrder(id: string, order: UpdateOrderDto): Promise<Order> {
    try {
      return await this.orderRepository.update(id, order);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /**
   *
   * @param userId
   * @returns las ordenes
   */
  public async getOrders(userId: string): Promise<Order[]> {
    try {
      return await this.orderRepository.findAllByUserId(userId);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /**
   * Get all orders by year
   * @param userId
   * @param date
   * @returns  All orders by year
   */
  public async getOrdersByYear(userId: string, date: Date): Promise<Order[]> {
    const dateStart: Date = this.dateFilterService.getFirstDateOfYear(date);
    const dateEnd: Date = this.dateFilterService.getLastDateOfYear(date);
    return await this.orderRepository.findByDateRange(userId, dateStart, dateEnd);
  }

  /**
   * Get all orders by month
   * @param userId
   * @param date
   * @returns  All orders by month
   */

  public async getOrdersByMonth(userId: string, date: Date): Promise<Order[]> {
    const dateStart: Date = this.dateFilterService.getFirstDateOfMonth(date);
    const dateEnd: Date = this.dateFilterService.getLastDateOfMonth(date);

    return await this.orderRepository.findByDateRange(userId, dateStart, dateEnd);
  }

  /**
   * Get all orders by week
   * @param userId
   * @param date
   * @returns  All orders by week
   */

  public async getOrdersByWeek(userId: string, date: Date): Promise<Order[]> {
    const dateStart: Date = this.dateFilterService.getLastDateOfWeek(date);
    const dateEnd: Date = this.dateFilterService.getLastDateOfWeek(date);

    return await this.orderRepository.findByDateRange(userId, dateStart, dateEnd);
  }

  /**
   * Get all orders by day
   * @param userId
   * @param date
   * @returns  All orders by day
   */

  public async getOrdersByDay(userId: string, date: Date): Promise<Order[]> {
    const dateStart: Date = this.dateFilterService.getFirstDateOfDay(date);
    const dateEnd: Date = this.dateFilterService.getLastDateOfDay(date);

    return await this.orderRepository.findByDateRange(userId, dateStart, dateEnd);
  }

  /**
   * Obtiene la ultima orden del usuario
   * @param userId - identificador de usuario
   * @returns la ultima orden o null
   */
  private getLastOrder = async (userId: string): Promise<Order | null> => {
    const orders = await this.orderRepository.findAllByUserId(userId);
    if (this.isOrdenEmpty(orders)) return null;
    return orders[orders.length - 1];
  };

  /**
   * Obtiene el monto total de la orden
   * @param order
   * @returns  Total de la orden
   */
  private calculateTotalAmount = (order: Order): number => {
    return order.items.reduce((acc, item) => acc + item.price, 0);
  };

  // public async getAllItems(userId: string): Promise<ItemDto[]> {
  //   const orders = await this.getOrders(userId);
  //   return orders.map((order) => order.items).flat();
  // }

  // public async getAllPrices(userId: string): Promise<number[]> {
  //   const items = await this.getAllItems(userId);
  //   return items.map((item) => item.price);
  // }

  // public async getCurrentWeekOrders(userId: string) {
  //   const { startOfWeek, endOfWeek } = this.getDateRangeOfWeek();
  //   return this.getOrdersByDateRange(userId, startOfWeek, endOfWeek);
  // }

  // private getDateRangeOfWeek() {
  //   const currentDate = new Date(); // Crea una copia de la fecha dada

  //   // Obtener el día de la semana (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
  //   const dayOfWeek = currentDate.getDay() || 7; // Si es domingo (0), se ajusta a 7 para calcular correctamente el lunes

  //   // Calcular el inicio de la semana (lunes)
  //   currentDate.setDate(currentDate.getDate() - dayOfWeek + 1);
  //   currentDate.setUTCHours(0, 0, 0, 0);
  //   const startOfWeek = new Date(currentDate);

  //   // Calcular el final de la semana (domingo)
  //   const endOfWeek = new Date(startOfWeek);
  //   endOfWeek.setDate(startOfWeek.getDate() + 6);
  //   endOfWeek.setUTCHours(23, 59, 59, 999);

  //   return { startOfWeek, endOfWeek };
  // }

  // public async getMonthlyOrders(userId: string): Promise<MonthlyOrders[]> {
  //   const currentYear: number = new Date().getUTCFullYear();

  //   const firstDatesOfYear: Date[] = this.dateService.getAllFirstDatesOfMonths(currentYear);
  //   const lastDatesOfYear: Date[] = this.dateService.getAllLastDatesOfMonths(currentYear);

  //   const ordersPromises = firstDatesOfYear.map((firstDate, index) =>
  //     this.getOrdersByDateRange(userId, firstDate, lastDatesOfYear[index]).then((orders) => ({
  //       month: index + 1,
  //       orders,
  //     })),
  //   );

  //   return await Promise.all(ordersPromises);
  // }
}
