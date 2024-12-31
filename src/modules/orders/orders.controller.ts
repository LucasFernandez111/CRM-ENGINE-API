import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ServiceAccountGuard } from 'src/modules/auth/guard/service-account.guard';
import { OrdersService } from './services/orders.service';
import { SalesStatisticsService } from './services/sales-statistics/sales-statistics.service';
import { StatisticsOrderService } from './services/statistics-order.service';
import { Order } from 'src/schemas';
import { CreateOrderDto, UpdateOrderDto } from './dto';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly statisticsOrderService: StatisticsOrderService,
    private readonly statisticsSalesService: SalesStatisticsService,
  ) {}

  @UseGuards(ServiceAccountGuard)
  @Get()
  async getOrders(@Request() req) {
    return await this.ordersService.getOrders(req.user.serviceAccount.email);
  }
  @UseGuards(ServiceAccountGuard)
  @Post()
  async createOrder(@Request() req, @Body() order: CreateOrderDto): Promise<any> {
    return await this.ordersService.createOrder(req.user.serviceAccount.email, order);
  }

  @HttpCode(200)
  @Post('whatsapp/:id')
  async sendOrderToWhatsApp(@Body() order: CreateOrderDto, @Param('id') userId: string) {
    return this.ordersService.createOrder(userId, order);
  }
  @UseGuards(ServiceAccountGuard)
  @Get('range')
  async getOrdersByDateRange(@Query('startDate') startDate: string, @Query('endDate') endDate: string, @Req() req) {
    return {
      orders: await this.ordersService.getOrdersByRange(
        req.user.serviceAccount.email,
        new Date(startDate),
        new Date(endDate),
      ),
    };
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string): Promise<void> {
    return await this.ordersService.deleteOrder(id);
  }

  @Put(':id')
  async updateOrder(@Param('id') id: string, @Body() order: UpdateOrderDto): Promise<Order> {
    return await this.ordersService.updateOrder(id, order);
  }
  @UseGuards(ServiceAccountGuard)
  @Get('statistics/sales')
  async getSummarySales(@Req() req) {
    return this.statisticsSalesService.getDetailsSalesReport(req.user.serviceAccount.email, new Date());
  }

  @UseGuards(ServiceAccountGuard)
  @Get('statistics/sales/months')
  async getSalesMonths(@Req() req) {
    return this.statisticsSalesService.getSalesByMonth(req.user.serviceAccount.email, new Date());
  }
  @UseGuards(ServiceAccountGuard)
  @Get('statistics/top-order')
  async getTopOrder(@Req() req) {
    return {
      topOrder: {
        period: await this.statisticsOrderService.getInfoTopOrder(req.user.serviceAccount.email),
        today: await this.statisticsOrderService.getInfoTopOrderToday(req.user.serviceAccount.email),
      },
    };
  }
}
