import { Injectable } from '@nestjs/common';
import ErrorManager from 'src/helpers/error.manager';
import { Order } from 'src/schemas/orders.schema';
import { OrderRepository } from './order-repository/order-repository.service';
import { CreateOrderDto, UpdateOrderDto } from '../dto';
import { DateFilterService } from './date-filter/date-filter.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly dateFilterService: DateFilterService,
  ) {}
  public async createOrder(userId: string, order: CreateOrderDto): Promise<Order> {
    try {
      const lastestOrder = await this.orderRepository.findLastestOrder(userId);

      const totalAmount = this.calculateTotalAmount(order).toFixed(2);

      const orderNumber = lastestOrder ? lastestOrder.orderNumber + 1 : 1;

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
      const updatedOrder = await this.orderRepository.update(id, order);
      if (!updatedOrder) throw new ErrorManager({ type: 'NOT_FOUND', message: 'Order not found for this id' });
      return updatedOrder;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /**
   *
   * @param userId Id del usuario al que pertenece la orden
   * @returns Todas las ordenes del usuario
   */
  public async getOrders(userId: string): Promise<Order[]> {
    try {
      return await this.orderRepository.findAllByUserId(userId);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /**
   * @param userId Id del usuario al que pertenece la orden
   * @param date
   * @returns  Todas las ordenes del año en especifico
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
    const dateStart: Date = this.dateFilterService.getFirstDateOfWeek(date);

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
   * @param userId ID del usuario al que pertenece la orden
   * @param startDate Fecha de inicio
   * @param endDate Fecha final
   * @returns  Todas las ordenes por rango de fecha
   */
  public async getOrdersByRange(userId: string, startDate: Date, endDate: Date): Promise<Order[]> {
    const startDateStart: Date = this.dateFilterService.setStartOfDateUTC(startDate);
    const endDateEnd: Date = this.dateFilterService.setEndOfDateUTC(endDate);

    console.log(startDateStart, endDateEnd);

    return await this.orderRepository.findByDateRange(userId, startDateStart, endDateEnd);
  }

  public async getOrderById(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new ErrorManager({ type: 'NOT_FOUND', message: 'Order not found for this id' });
    return order;
  }

  /**
   * @param order
   * @returns  Monto total de la orden
   */
  private calculateTotalAmount = (order: CreateOrderDto) => {
    return order.items.reduce((acc, item) => acc + item.price, 0);
  };
}
