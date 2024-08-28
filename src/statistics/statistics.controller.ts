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

    const { description: descriptionTop, price: priceTop } = orderTop;

    const statistics = { descriptionTop, priceTop, totalSales };

    return statistics;
  }
}
