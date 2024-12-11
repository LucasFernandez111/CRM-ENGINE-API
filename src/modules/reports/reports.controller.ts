import { Controller, Get, Param, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Response } from 'express';
import { OrdersService } from '../orders/services/orders.service';
import { SalesStatisticsService } from '../orders/services/sales-statistics/sales-statistics.service';
import { StatisticsOrderService } from '../orders/services/statistics-order.service';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly ordersService: OrdersService,
    private readonly statisticsSalesService: SalesStatisticsService,
    private readonly statisticsOrderService: StatisticsOrderService,
  ) {}

  @Get('bill/:id')
  async getBillReports(@Res() response: Response, @Param('id') id: string) {
    const order = await this.ordersService.getOrderById(id);
    const pdfDoc = await this.reportsService.getBillReport(order);

    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', 'attachment; filename="factura.pdf"');
    pdfDoc.info.Title = 'Factura';
    pdfDoc.pipe(response);

    pdfDoc.end();
  }

  @Get('sales')
  async getSalesReports(@Res() response: Response) {
    const totalSalesSummary = await this.statisticsSalesService.getDetailsSalesReport(
      '111601204432361741631',
      new Date(),
    );

    const statisticsTopOrder = await this.statisticsOrderService.getInfoTopOrder('111601204432361741631');
    const pdfDoc = await this.reportsService.getSalesReport(totalSalesSummary, statisticsTopOrder);

    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', 'attachment; filename="factura.pdf"');
    pdfDoc.info.Title = 'Factura';
    pdfDoc.pipe(response);

    pdfDoc.end();
  }
}
