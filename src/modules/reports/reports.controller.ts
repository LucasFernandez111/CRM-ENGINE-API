import { Controller, Get, Param, Request, Res, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Response } from 'express';
import { OrdersService } from '../orders/services/orders.service';
import { SalesStatisticsService } from '../orders/services/sales-statistics/sales-statistics.service';
import { StatisticsOrderService } from '../orders/services/statistics-order.service';
import { ServiceAccountGuard } from '../auth/guard/service-account.guard';

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

  @UseGuards(ServiceAccountGuard)
  @Get('sales')
  async getSalesReports(@Request() req, @Res() response: Response) {
    const totalSalesSummary = await this.statisticsSalesService.getDetailsSalesReport(
      req.user.serviceAccount.email,
      new Date(),
    );

    const statisticsTopOrder = await this.statisticsOrderService.getInfoTopOrder(req.user.serviceAccount.email);

    const statisticsMonths = await this.statisticsSalesService.getSalesByMonth(
      req.user.serviceAccount.email,
      new Date(),
    );
    const pdfDoc = await this.reportsService.getSalesReport(totalSalesSummary, statisticsTopOrder, statisticsMonths);

    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', 'attachment; filename="factura.pdf"');
    pdfDoc.info.Title = 'Factura';
    pdfDoc.pipe(response);

    pdfDoc.end();
  }
}
