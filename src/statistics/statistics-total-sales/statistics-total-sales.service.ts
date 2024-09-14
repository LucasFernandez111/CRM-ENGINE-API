import { Injectable } from '@nestjs/common';
import { ErrorManager } from '../../config/error.manager';
import { OrdersService } from '../../orders/orders.service';
import { Order } from 'src/schemas/orders.schema';
import { MonthDates } from '../interfaces/month-dates.interface';
import { DateService } from 'src/date/date.service';

@Injectable()
export class StatisticsTotalSalesService {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly dateService: DateService,
  ) {}

  public async getTotalSales(userId: string): Promise<number> {
    try {
      const orders: Order[] = await this.ordersService.getOrders(userId);
      return this.getTotalSalesForOrder(orders);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async getTotalSalesByWeek(userId: string): Promise<number> {
    try {
      const ordersWeek: Order[] = await this.ordersService.getCurrentWeekOrders(userId);

      return this.getTotalSalesForOrder(ordersWeek);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async getTotalSalesByDay(userId: string): Promise<number> {
    try {
      const ordersDay: Order[] = await this.ordersService.getOrdersByDay(userId);
      return this.getTotalSalesForOrder(ordersDay);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async getTotalSalesByMonth(userId: string): Promise<number[]> {
    try {
      const currentYear = new Date().getUTCFullYear();

      const firstDatesMonth = this.dateService.getAllFirstDatesOfMonths(currentYear);
      const lastDatesMonth = this.dateService.getAllLastDatesOfMonths(currentYear);

      const promiseArr = firstDatesMonth.map((firstDate, index) =>
        this.ordersService.getOrdersByDateRange(userId, firstDate, lastDatesMonth[index]),
      );

      const allOrdersByMonth = await Promise.all(promiseArr);

      return allOrdersByMonth.map((orders) => this.getTotalSalesForOrder(orders));
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  private getTotalSalesForOrder(orders: Order[]): number {
    return orders.reduce((total, order) => total + order.totalAmount, 0);
  }
}
