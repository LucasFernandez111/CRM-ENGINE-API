import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OrdersService } from 'src/orders/orders.service';
import { Orders } from 'src/schemas/orders.schema';
@Injectable()
export class StatisticsService {
  constructor(private readonly OrdersService: OrdersService) {}

  /**
   * Obtiene la orden mas vendida mediante el top selling
   */
  async getTopSellingOrder(id_token: string): Promise<Orders> {
    try {
      const orders = await this.OrdersService.getOrders(id_token);

      const foods = orders.map((order: Orders) =>
        order.description.toUpperCase(),
      );

      const foodTop = this.getElementTop(foods);

      const orderTop = orders.find(
        (order: Orders) => order.description.toUpperCase() === foodTop,
      );

      return orderTop;
    } catch (error) {
      throw new InternalServerErrorException(error?.message);
    }
  }

  /**
   * Obtiene el total de ventas
   */
  async getTotalSales(id_token: string): Promise<number> {
    try {
      const orders = await this.OrdersService.getOrders(id_token);
      const prices = orders.map((order: Orders) => order.price);
      const totalSales = prices.reduce((a, b) => a + b, 0);
      return totalSales;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error calculating total sales: ',
        error?.message,
      );
    }
  }

  /**
   * Obtiene el elemento mas alto de un array
   */
  getElementTop(elements: Array<string | number>): string | number {
    return elements
      .sort(
        (a, b) =>
          elements.filter((x) => x === a).length -
          elements.filter((x) => x === b).length,
      )
      .pop();
  }
}
