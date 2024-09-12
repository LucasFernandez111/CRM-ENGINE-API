import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { OrdersService } from 'src/orders/orders.service';
import { Order } from 'src/schemas/orders.schema';
import { MonthDates, MonthlySalesWithOrders } from './interfaces/month-dates.interface';
import { ItemDto } from 'src/orders/dto/item.dto';
@Injectable()
export class StatisticsService {
  constructor(private readonly OrdersService: OrdersService) {}

  /**
   * Obtiene el pedido mas vendido mediante todas los pedidos del usuario
   */
  async getTopSellingOrder(userId: string) {
    try {
      const orders: Order[] = await this.OrdersService.getOrders(userId);
      const items: ItemDto[][] = orders.map((order: Order) => order.items);
      console.log(items);

      // const itemTop = this.getElementTop(itemsNames.flat());

      // const orderTop = orders.find((order: any) => order.items.name.toUpperCase() === itemTop);

      // return orderTop;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error?.message);
    }
  }

  // /**
  //  * Obtiene el total de ventas
  //  */
  // async getTotalSales(id_token: string): Promise<number> {
  //   try {
  //     const orders = await this.OrdersService.getOrders(id_token);
  //     const prices = orders.map((order: any) => order.items.price);
  //     const totalSales = prices.reduce((a, b) => a + b, 0);
  //     return totalSales;
  //   } catch (error) {
  //     throw new InternalServerErrorException('Error calculating total sales: ', error?.message);
  //   }
  // }

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

  // async getTotalSalesByWeek(id_token: string): Promise<any> {
  //   try {
  //     const currentDate = new Date();
  //     const { startOfWeek, endOfWeek } = this.getStartAndEndOfWeek(currentDate);

  //     const orders = await this.OrdersService.getRecordsByDateRange(id_token, startOfWeek, endOfWeek);
  //     const totalSalesByWeek = this.getTotalSalesOfOrders(orders);
  //     return totalSalesByWeek;
  //   } catch (error) {
  //     throw new InternalServerErrorException('Error getting orders: ', error?.message);
  //   }
  // }
  // async getTotalSalesByMonth(id_token: string): Promise<any> {
  //   try {
  //     const firstAndLastDateOfMonth: MonthDates[] = this.getFirstAndLastDateOfMonth();

  //     const totalSalesByMonth: any = await Promise.all(
  //       firstAndLastDateOfMonth.map(async (monthDates) => {
  //         const orders = await this.OrdersService.getRecordsByDateRange(
  //           id_token,
  //           monthDates.firstDate,
  //           monthDates.lastDate,
  //         );

  //         const totalSalesForMonth = this.getTotalSalesOfOrders(orders);

  //         return { totalSalesForMonth, monthDates };
  //       }),
  //     );

  //     return totalSalesByMonth;
  //   } catch (err) {
  //     throw new InternalServerErrorException(err?.message);
  //   }
  // }

  // /**
  //  * Obtiene el elemento que mas aparece de un array
  //  */
  // private getElementTop(elements: Array<string | number>): string | number {
  //   return elements
  //     .sort((a, b) => elements.filter((x) => x === a).length - elements.filter((x) => x === b).length)
  //     .pop();
  // }

  // /**
  //  * Obtiene la última fecha del mes para un año y mes dados.
  //  *
  //  * @param {number} year - El año (e.g., 2024).
  //  * @param {number} month - El mes (1-12) donde 1 es enero y 12 es diciembre.
  //  * @returns {Date} - La fecha del último día del mes con la hora ajustada a 23:59:59.999 UTC.
  //  */
  // private getLastDateOfMonth(year: number, month: number): Date {
  //   const lastDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
  //   return lastDate;
  // }

  // /**
  //  * Devuelve un arreglo de objetos que contienen la primera y última fecha de cada mes del año actual.
  //  *
  //  * @return {MonthDates[]} Un arreglo de objetos, cada uno conteniendo el número del mes, la primera fecha del mes y la última fecha del mes.
  //  */
  // private getFirstAndLastDateOfMonth(): MonthDates[] {
  //   const currentYear = new Date().getFullYear();

  //   return Array.from({ length: 12 }, (_, i) => {
  //     const month = i + 1;
  //     const firstDate = new Date(Date.UTC(currentYear, i, 1));
  //     const lastDate = this.getLastDateOfMonth(currentYear, month);

  //     return { month, firstDate, lastDate } as MonthDates;
  //   });
  // }

  // private getStartAndEndOfWeek(date: Date) {
  //   const currentDate = new Date(date); // Crea una copia de la fecha dada

  //   // Obtener el día de la semana (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
  //   const dayOfWeek = currentDate.getDay();

  //   // Calcular la diferencia para obtener el Lunes (primer día de la semana)
  //   const diffToMonday = currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);

  //   const startOfWeek = new Date(currentDate.setDate(diffToMonday));
  //   startOfWeek.setUTCHours(0, 0, 0, 0);

  //   const endOfWeek = new Date(startOfWeek);
  //   endOfWeek.setUTCDate(startOfWeek.getDate() + 6);
  //   endOfWeek.setUTCHours(23, 59, 59, 999);

  //   return { startOfWeek, endOfWeek };
  // }

  // private getTotalSalesOfOrders(orders: Order[]): void {
  //   // return orders.reduce((sum, order) => sum + order., 0);
  // }
}
