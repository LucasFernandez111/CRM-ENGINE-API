import { Controller, Req, Get, Param } from '@nestjs/common';
import { SalesStatisticsService } from '../services/sales-statistics/sales-statistics.service';
import { Request } from 'express';

@Controller('orders/statistics')
export class OrdersStatisticsController {
  constructor(private readonly salesStatisticsService: SalesStatisticsService) {}

  @Get('sales/total')
  async getTotalSalesAmount(@Req() req: Request) {
    const userId = req.cookies['id_token'];
    const totalSalesAmount = await this.salesStatisticsService.getTotalSalesAmount(userId);
    return { totalSalesAmount };
  }

  @Get('sales/total/day/:date')
  async getTotalSalesByDay(@Req() req: Request, @Param('date') date: string) {
    const userId = req.cookies['id_token'];

    return await this.salesStatisticsService.getTotalSalesByDay(userId, date);
  }

  // async getTotalSalesByDay(@Req() req: Request) {
  //   const userId = req.cookies['id_token']; // Accede a la cookie 'id_token'
  //   return await this.statictsTotalSales.getTotalSalesByDay(userId);
  // }
  // @Get('total-sales-by-month')
  // async getAllTotalSalesByMonth(@Req() req: Request) {
  //   const userId = req.cookies['id_token']; // Accede a la cookie 'id_token'
  //   return await this.statictsTotalSales.getTotalSalesByMonth(userId);
  // }
  // @Get('total-sales-by-month:id')
  // async getTotalSalesByMonth(@Req() req: Request) {
  //   const userId = req.cookies['id_token']; // Accede a la cookie 'id_token'
  //   return await this.statictsTotalSales.getTotalSalesByMonth(userId);
  // }
  // @Get('total-sales-by-week')
  // async getTotalSalesByWeek(@Req() req: Request) {
  //   const id_token = req.cookies['id_token']; // Accede a la cookie 'id_token'
  //   return await this.statisticsService.getTotalSalesByWeek(id_token);
  // }
  // @Get('statistics-by-day')
  // async getStatisticsByDay(@Req() req: Request) {
  //   const id_token = req.cookies['id_token']; // Accede a la cookie 'id_token'
  //   return await this.statisticsService.getStatisticsByDay(id_token);
  // }
  // @Get('summary')
  // async getStatisticsSummary(@Req() req: Request) {
  //   const id_token = req.cookies['id_token']; // Accede a la cookie 'id_token'
  //   const totalSales = await this.statisticsService.getTotalSales(id_token);
  //   const totalSalesByMonth = await this.statisticsService.getTotalSalesByMonth(id_token);
  //   const statisticsByDay = await this.statisticsService.getStatisticsByDay(id_token);
  //   const totalSalesByWeek = await this.statisticsService.getTotalSalesByWeek(id_token);
  //   return {
  //     totalSales,
  //     totalSalesByMonth,
  //     statisticsByDay,
  //     totalSalesByWeek,
  //   };
  // }
}
