import { Injectable } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { Order } from '../schemas/orders.schema';
import { MonthDates, MonthlySalesWithOrders } from './interfaces/month-dates.interface';
import { ItemDto } from '../orders/dto/item.dto';
import { ErrorManager } from '../config/error.manager';
@Injectable()
export class StatisticsService {
  constructor(private readonly OrdersService: OrdersService) {}

  /**
   * Gets the top item of the user
   * @param {string} userId The user id
   * @returns {Promise<ItemDto>} The top item
   */
  public async getTopItem(userId: string): Promise<ItemDto> {
    try {
      const orders: Order[] = await this.OrdersService.getOrders(userId);
      const allItems: ItemDto[] = await this.OrdersService.getAllItems(userId);

      const topItemName: string | number = this.getTopItemName(allItems);

      return this.findTopItemInOrders(orders, topItemName);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

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
