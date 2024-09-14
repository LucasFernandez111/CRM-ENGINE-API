import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { StatisticsService } from './statistics.service';
import { StatisticsTotalSalesService } from './statistics-total-sales/statistics-total-sales.service';

@Controller('statistics')
export class StatisticsController {
  constructor(
    private readonly statisticsService: StatisticsService,
    private readonly statictsTotalSales: StatisticsTotalSalesService,
  ) {}

  @Get('total-sales')
  async getTotalSales(@Req() req: Request) {
    const userId = req.cookies['id_token']; // Accede a la cookie 'id_token'
    return await this.statictsTotalSales.getTotalSales(userId);
  }

  @Get('total-sales-by-day')
  async getTotalSalesByDay(@Req() req: Request) {
    const userId = req.cookies['id_token']; // Accede a la cookie 'id_token'
    return await this.statictsTotalSales.getTotalSalesByDay(userId);
  }

  @Get('total-sales-by-month')
  async getAllTotalSalesByMonth(@Req() req: Request) {
    const userId = req.cookies['id_token']; // Accede a la cookie 'id_token'
    return await this.statictsTotalSales.getTotalSalesByMonth(userId);
  }

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
