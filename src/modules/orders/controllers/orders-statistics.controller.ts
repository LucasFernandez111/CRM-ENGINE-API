import { Controller, Req, Get, UseGuards } from '@nestjs/common';
import { SalesStatisticsService } from '../services/sales-statistics/sales-statistics.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth-guard/jwt-auth.guard';
import { PayloadToken } from 'src/modules/auth/interfaces/payload-token.interface';
import { UserExistsGuard } from 'src/modules/users/guards/user-exists.guard';
import { StatisticsOrderService } from '../services/statistics-order.service';

@Controller('orders/statistics')
export class OrdersStatisticsController {
  constructor(
    private readonly salesStatisticsService: SalesStatisticsService,
    private readonly statisticsOrderService: StatisticsOrderService,
  ) {}

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

        topOrder: await this.statisticsOrderService.getInfoTopOrderToday('107135827814026716179'),
      },
    };
  }
}
