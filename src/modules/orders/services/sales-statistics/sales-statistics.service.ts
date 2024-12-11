import { Injectable } from '@nestjs/common';
import { OrdersService } from '../orders.service';
import { Order } from 'src/schemas/orders.schema';
import { ItemDto } from '../../dto';
import { DateFilterService } from '../date-filter/date-filter.service';
import ErrorManager from 'src/helpers/error.manager';

@Injectable()
export class SalesStatisticsService {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly dateFilterService: DateFilterService,
  ) {}

  public async getSalesByMonth(userId: string, date: Date): Promise<any[]> {
    try {
      const months = this.dateFilterService.getMonths(date);

      // Aseguramos que cada promesa sea esperada correctamente
      const salesMonthPromise = months.map(async (month, i) => ({
        month: i + 1,
        dateMonth: this.dateFilterService.toString(month),
        total: await this.getTotalSalesByMonth(userId, month), // Esperar el valor aquí
      }));

      // Esperamos a que todas las promesas se resuelvan
      return await Promise.all(salesMonthPromise);
    } catch (error) {
      throw ErrorManager.createSignatureError(error);
    }
  }

  /**
   * Get total sales by monthly
   * @param userId
   * @param date
   * @returns {Promise<number>} - total sales by monthly
   */
  public async getTotalSalesByMonth(userId: string, date: Date): Promise<number> {
    try {
      const orders: Order[] = await this.ordersService.getOrdersByMonth(userId, date);

      return this.calculateTotalAmounts(orders);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /**
   *  Get total sales by daily
   * @param userId
   * @param date
   * @returns  {Promise<number>} - total sales by daily
   */

  public async getTotalSalesByDay(userId: string, date: Date): Promise<number> {
    const orders: Order[] = await this.ordersService.getOrdersByDay(userId, date);

    return this.calculateTotalAmounts(orders);
  }

  public async getTotalSalesByWeek(userId: string, date: Date): Promise<number> {
    const orders: Order[] = await this.ordersService.getOrdersByWeek(userId, date);

    return this.calculateTotalAmounts(orders);
  }

  /**
   *
   * @param userId
   * @returns
   */
  public async getTotalSalesByYearl(userId: string, date: Date) {
    const orders: Order[] = await this.ordersService.getOrdersByYear(userId, date);
    return this.calculateTotalAmounts(orders);
  }

  /**
   * Get total sales of all orders the user
   * @param userId
   * @returns {Promise<number>}  total sales
   */
  public async getTotalSales(userId: string): Promise<number> {
    try {
      const orders: Order[] = await this.ordersService.getOrders(userId);

      return this.calculateTotalAmounts(orders);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
  public async getTotalSalesSummary(userId: string, date: Date) {
    return {
      day: await this.getTotalSalesByDay(userId, date),
      week: await this.getTotalSalesByWeek(userId, date),
      month: await this.getTotalSalesByMonth(userId, date),
      year: await this.getTotalSalesByYearl(userId, date),
    };
  }

  public async getDetailsSalesReport(userId: string, date: Date) {
    return {
      sales: {
        total: await this.getTotalSales(userId),
        current: await this.getTotalSalesSummary(userId, date),
        periodSales: {
          salesMonth: await this.getSalesByMonth(userId, date),
        },
      },
    };
  }
  private calculateTotalAmounts(orders: Order[]): number {
    return orders.reduce((acc, order) => acc + order.totalAmount, 0);
  }

  /**
   * Obtiene el elemento que mas aparece de un array
   */
  private getElementTop(elements: Array<string | number>): string | number {
    return elements
      .sort((a, b) => elements.filter((x) => x === a).length - elements.filter((x) => x === b).length)
      .pop();
  }
  private getTopItemName(items: ItemDto[]): string | number {
    const itemNames = items.map((item) => item.category.toUpperCase());
    return this.getElementTop(itemNames);
  }
  private findTopItemInOrders(orders: Order[], topItemName: string | number): ItemDto | null {
    return orders.flatMap((order) => order.items).find((item) => item.category.toUpperCase() === topItemName) || null;
  }
}
