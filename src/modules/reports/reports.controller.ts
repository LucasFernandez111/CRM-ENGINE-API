import { Controller, Get, Param, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Response } from 'express';
import { OrdersService } from '../orders/services/orders.service';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly ordersService: OrdersService,
  ) {}

  @Get('bill/:id')
  async getBillReports(@Res() response: Response, @Param('id') id: string) {
    const order = await this.ordersService.getOrderById(id);
    const pdfDoc = await this.reportsService.getBillReport(order);

    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = 'Factura';
    pdfDoc.pipe(response);

    pdfDoc.end();
  }
}
