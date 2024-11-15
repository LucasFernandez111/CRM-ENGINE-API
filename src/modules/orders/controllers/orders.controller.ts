import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import ErrorManager from 'src/config/error.manager';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth-guard/jwt-auth.guard';
import { PayloadToken } from 'src/modules/auth/interfaces/payload-token.interface';
import { GeneratePDFService } from 'src/modules/generate/generate.service';
import { UserExistsGuard } from 'src/modules/users/guards/user-exists.guard';
import { Order } from '../../../schemas/orders.schema';
import { CreateOrderDto, UpdateOrderDto } from '../dto';
import { OrdersService } from '../services/orders.service';
import { SalesStatisticsService } from '../services/sales-statistics/sales-statistics.service';
import { StatisticsOrderService } from '../services/statistics-order.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly generateService: GeneratePDFService,
    private readonly statisticsOrderService: StatisticsOrderService,
    private readonly statisticsSalesService: SalesStatisticsService,
  ) {}

  @Get('pdf/:id')
  async getOrderPDF(@Param('id') id: string, @Res() res: Response) {
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="report.pdf"',
    });

    const docPDF = await this.generateService.getReportPDF(res, id);

    await docPDF.end();
  }

  @Post()
  @UseGuards(JwtAuthGuard, UserExistsGuard)
  async createOrder(@Req() req, @Body() order: CreateOrderDto): Promise<any> {
    const { sub: userId }: PayloadToken = req.user;

    return this.ordersService.createOrder(userId, order);
  }

  @Get('range')
  @UseGuards(JwtAuthGuard, UserExistsGuard)
  async getOrdersByDateRange(@Query('startDate') startDate: string, @Query('endDate') endDate: string, @Req() req) {
    const { sub: userId }: PayloadToken = req.user;

    return { orders: await this.ordersService.getOrdersByRange(userId, new Date(startDate), new Date(endDate)) };
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string): Promise<void> {
    return await this.ordersService.deleteOrder(id);
  }

  @Put(':id')
  async updateOrder(@Param('id') id: string, @Body() order: UpdateOrderDto): Promise<Order> {
    return await this.ordersService.updateOrder(id, order);
  }

  @Get('statistics/sales')
  @UseGuards(JwtAuthGuard, UserExistsGuard)
  async getSummarySales(@Req() req) {
    const { sub: userId, sheetId }: PayloadToken = req.user;
    const initialDate = new Date();

    if (!sheetId) {
      throw ErrorManager.createSignatureError(
        new ErrorManager({ type: 'UNAUTHORIZED', message: 'ID sheet not found' }).message,
      );
    }
    return {
      sales: {
        total: await this.statisticsSalesService.getTotalSales(userId),
        current: await this.statisticsSalesService.getTotalSalesSummary(userId, initialDate),
        periodSales: {
          salesMonth: await this.statisticsSalesService.getSalesByMonth(userId, initialDate),
          salesWeek: '',
          salesDay: '',
          salesYear: '',
        },
      },
    };
  }

  @Get('statistics/top-order')
  @UseGuards(JwtAuthGuard, UserExistsGuard)
  async getTopOrder(@Req() req) {
    const { sub: userId, sheetId }: PayloadToken = req.user;
    if (!sheetId) {
      throw ErrorManager.createSignatureError(
        new ErrorManager({ type: 'UNAUTHORIZED', message: 'ID sheet not found' }).message,
      );
    }

    return {
      topOrder: {
        period: await this.statisticsOrderService.getInfoTopOrder(userId),
        today: await this.statisticsOrderService.getInfoTopOrderToday(userId),
      },
    };
  }
}
