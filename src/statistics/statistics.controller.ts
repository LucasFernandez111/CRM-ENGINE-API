import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { StatisticsService } from './statistics.service';
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly StatisticsService: StatisticsService) {}
  @Get()
  async getStatistics(@Req() req: Request) {
    const id_token = req.cookies['id_token'];

    const orderTop = await this.StatisticsService.getTopSellingOrder(id_token);

    const totalSales = await this.StatisticsService.getTotalSales(id_token);

    const totalSalesByMonth =
      await this.StatisticsService.getTotalSalesByMonth(id_token);

    const statisticsByDay =
      await this.StatisticsService.getStatisticsByDay(id_token);

    const totalSalesByWeek =
      await this.StatisticsService.getTotalSalesByWeek(id_token);

    const { description: descriptionTop, price: priceTop } = orderTop;

    const statistics = {
      descriptionTop,
      priceTop,
      totalSales,
      statisticsByDay,
      totalSalesByMonth,
      totalSalesByWeek,
    };

    return statistics;
  }
}
