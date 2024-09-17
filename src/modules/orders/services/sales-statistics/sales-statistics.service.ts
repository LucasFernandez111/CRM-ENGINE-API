import { Injectable } from '@nestjs/common';
import { OrdersService } from '../orders.service';
import { ErrorManager } from 'src/config/error.manager';
import { Order } from 'src/schemas/orders.schema';
import { OrderRepository } from '../order-repository/order-repository.service';

@Injectable()
export class SalesStatisticsService {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly orderRepository: OrderRepository,
  ) {}

  /**
   * Retrieves the total sales amount for a given user.
   * @param userId The ID of the user
   * @returns The total sales amount
   */
  public async getTotalSalesAmount(userId: string): Promise<number> {
    try {
      // Get the orders for the user
      const orders: Order[] = await this.ordersService.getOrders(userId);

      // Calculate the total sales amount by summing up the total amounts of all orders
      return;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async getTotalSalesByDay(userId: string, date: string) {
    try {
      const dateStart: Date = this.setInitialTime(new Date(date));
      const dateEnd: Date = this.setFinishTime(new Date(date));

      const dateStartUTC: Date = this.generateDateUTC(dateStart);
      const dateEndUTC: Date = this.generateDateUTC(dateEnd);

      // const orders: Order[] = await this.orderRepository.findByDateRange(dateStartUTC, dateEndUTC);

      return { dateStartUTC, dateEndUTC };
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  private calculateTotalAmounts(orders: Order[]): number {
    return orders.reduce((acc, order) => acc + order.totalAmount, 0);
  }
  private generateDateUTC(date: Date): Date {
    return new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds(),
      ),
    );
  }

  private setInitialTime(date: Date): Date {
    return new Date(date.setUTCHours(0, 0, 0, 0));
  }
  private setFinishTime(date: Date): Date {
    return new Date(date.setUTCHours(23, 59, 99, 999));
  }

  // public async getTotalSalesByWeek(userId: string): Promise<number> {
  //   try {
  //     const ordersWeek: Order[] = await this.ordersService.getCurrentWeekOrders(userId);
  //     return this.getTotalSalesForOrder(ordersWeek);
  //   } catch (error) {
  //     throw ErrorManager.createSignatureError(error.message);
  //   }
  // }
  // public async getTotalSalesByDay(userId: string): Promise<number> {
  //   try {
  //     const ordersDay: Order[] = await this.ordersService.getOrdersByDay(userId);
  //     return this.getTotalSalesForOrder(ordersDay);
  //   } catch (error) {
  //     throw ErrorManager.createSignatureError(error.message);
  //   }
  // }
  // public async getTotalSalesByMonth(userId: string): Promise<number[]> {
  //   try {
  //     const currentYear = new Date().getUTCFullYear();
  //     const firstDatesMonth = this.dateService.getAllFirstDatesOfMonths(currentYear);
  //     const lastDatesMonth = this.dateService.getAllLastDatesOfMonths(currentYear);
  //     const promiseArr = firstDatesMonth.map((firstDate, index) =>
  //       this.ordersService.getOrdersByDateRange(userId, firstDate, lastDatesMonth[index]),
  //     );
  //     const allOrdersByMonth = await Promise.all(promiseArr);
  //     return allOrdersByMonth.map((orders) => this.getTotalSalesForOrder(orders));
  //   } catch (error) {
  //     throw ErrorManager.createSignatureError(error.message);
  //   }
  // }
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
  // private getElementTop(elements: Array<string | number>): string | number {
  //   return elements
  //     .sort((a, b) => elements.filter((x) => x === a).length - elements.filter((x) => x === b).length)
  //     .pop();
  // }
  // private getTopItemName(items: ItemDto[]): string | number {
  //   const itemNames = items.map((item) => item.name.toUpperCase());
  //   return this.getElementTop(itemNames);
  // }
  // private findTopItemInOrders(orders: Order[], topItemName: string | number): ItemDto | null {
  //   return orders.flatMap((order) => order.items).find((item) => item.name.toUpperCase() === topItemName) || null;
  // }
}
