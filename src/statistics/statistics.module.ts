import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { OrdersModule } from '../orders/orders.module';
import { StatisticsTotalSalesService } from './statistics-total-sales/statistics-total-sales.service';
import { DateModule } from 'src/date/date.module';

@Module({
  imports: [OrdersModule, DateModule],
  controllers: [StatisticsController],
  providers: [StatisticsService, StatisticsTotalSalesService],
})
export class StatisticsModule {}
