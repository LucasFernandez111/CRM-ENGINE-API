import { Controller, Req, Get, Param } from '@nestjs/common';
import { SalesStatisticsService } from '../services/sales-statistics/sales-statistics.service';
import { Request } from 'express';

@Controller('orders/statistics')
export class OrdersStatisticsController {
  constructor(private readonly salesStatisticsService: SalesStatisticsService) {}

  @Get('sales')
  async getSummarySales(@Req() req: Request) {
    const userId = req.cookies['id_token'];

    const initialDate = new Date(); //Current Date

    return {
      sales: {
        total: await this.salesStatisticsService.getTotalSales(userId),
        current: await this.salesStatisticsService.getTotalSalesSummary(userId, initialDate),
        periodSales: {
          salesMonth: await this.salesStatisticsService.getSalesByMonth(userId, initialDate),
          salesWeek: '',
          salesDay: '',
          salesYear: '',
        },
      },
    };
  }

  @Get('sales:date')
  async getSummarySalesByDate(@Param('date') date: string, @Req() req: Request) {}

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
