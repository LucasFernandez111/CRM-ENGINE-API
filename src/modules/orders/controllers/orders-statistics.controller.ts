import { Controller, Req, Get, Param, UseGuards, Query } from '@nestjs/common';
import { SalesStatisticsService } from '../services/sales-statistics/sales-statistics.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth-guard/jwt-auth.guard';
import { PayloadToken } from 'src/modules/auth/interfaces/payload-token.interface';
import { UserExistsGuard } from 'src/modules/users/guards/user-exists.guard';

@Controller('orders/statistics')
export class OrdersStatisticsController {
  constructor(private readonly salesStatisticsService: SalesStatisticsService) {}

  @Get('sales')
  @UseGuards(JwtAuthGuard, UserExistsGuard)
  async getSummarySales(@Req() req) {
    const { sub: userId }: PayloadToken = req.user;

    const initialDate = new Date();

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
}
