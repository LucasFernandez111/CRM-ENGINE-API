import { Injectable } from '@nestjs/common';
import { OrdersService } from '../orders.service';
import { ErrorManager } from 'src/config/error.manager';
import { Order } from 'src/schemas/orders.schema';

import { ItemDto } from '../../dto';
import { DateFilterService } from '../date-filter/date-filter.service';

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

      console.log(orders);

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

  public async getTotalSalesByDayl(userId: string, date: Date): Promise<number> {
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
      day: await this.getTotalSalesByDayl(userId, date),
      week: await this.getTotalSalesByWeek(userId, date),
      month: await this.getTotalSalesByMonth(userId, date),
      year: await this.getTotalSalesByYearl(userId, date),
    };
  }
  private calculateTotalAmounts(orders: Order[]): number {
    return orders.reduce((acc, order) => acc + order.totalAmount, 0);
  }

  // private getTotalSalesForOrder(orders: Order[]): number {
  //   return orders.reduce((total, order) => total + order.totalAmount, 0);
  // }
  // /**
  //  * Gets the top item of the user
  //  * @param {string} userId The user id
  //  * @returns {Promise<ItemDto>} The top item
  //  */
  // public async getTopItem(userId: string): Promise<ItemDto> {
  //   try {
  //     const orders: Order[] = await this.OrdersService.getOrders(userId);
  //     const allItems: ItemDto[] = await this.OrdersService.getAllItems(userId);
  //     const topItemName: string | number = this.getTopItemName(allItems);
  //     return this.findTopItemInOrders(orders, topItemName);
  //   } catch (error) {
  //     throw ErrorManager.createSignatureError(error.message);
  //   }
  // /** Obtiene las ordenes totales del dia */
  // async getStatisticsByDay(id_token: string): Promise<any> {
  //   try {
  //     const startOfDay = new Date();
  //     const endOfDay = new Date();
  //     startOfDay.setUTCHours(0, 0, 0, 0);
  //     endOfDay.setUTCHours(23, 59, 59, 999);
  //     const orders = await this.OrdersService.getRecordsByDateRange(id_token, startOfDay, endOfDay);
  //     const totalSalesByDay = this.getTotalSalesOfOrders(orders);
  //     return { totalOrdersByDay: orders.length, totalSalesByDay };
  //   } catch (error) {
  //     throw new InternalServerErrorException('Error getting orders: ', error?.message);
  //   }
  // }
  /**
   * Obtiene el elemento que mas aparece de un array
   */
  private getElementTop(elements: Array<string | number>): string | number {
    return elements
      .sort((a, b) => elements.filter((x) => x === a).length - elements.filter((x) => x === b).length)
      .pop();
  }
  private getTopItemName(items: ItemDto[]): string | number {
    const itemNames = items.map((item) => item.name.toUpperCase());
    return this.getElementTop(itemNames);
  }
  private findTopItemInOrders(orders: Order[], topItemName: string | number): ItemDto | null {
    return orders.flatMap((order) => order.items).find((item) => item.name.toUpperCase() === topItemName) || null;
  }
}
