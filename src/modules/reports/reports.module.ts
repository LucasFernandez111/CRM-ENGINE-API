import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { PrinterModule } from '../printer/printer.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [PrinterModule, OrdersModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
