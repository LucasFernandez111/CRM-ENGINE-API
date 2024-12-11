import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import ErrorManager from 'src/helpers/error.manager';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth-guard/jwt-auth.guard';
import { PayloadToken } from 'src/modules/auth/interfaces/payload-token.interface';
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
    private readonly statisticsOrderService: StatisticsOrderService,
    private readonly statisticsSalesService: SalesStatisticsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, UserExistsGuard)
  async createOrder(@Req() req, @Body() order: CreateOrderDto): Promise<any> {
    const { sub: userId }: PayloadToken = req.user;

    return this.ordersService.createOrder(userId, order);
  }

  @HttpCode(200)
  @Post('whatsapp/:id')
  async sendOrderToWhatsApp(@Body() order: CreateOrderDto, @Param('id') userId: string) {
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
    return this.statisticsSalesService.getDetailsSalesReport(userId, initialDate);
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
