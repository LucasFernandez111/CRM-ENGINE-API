import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Order } from '../../../schemas/orders.schema';
import { UpdateOrderDto, CreateOrderDto } from '../dto';
import { OrdersService } from '../services/orders.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth-guard/jwt-auth.guard';
import { UserExistsGuard } from 'src/modules/users/guards/user-exists.guard';
import { PayloadToken } from 'src/modules/auth/interfaces/payload-token.interface';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

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

  async updateOrder(@Param('id') id: string, @Body() order: UpdateOrderDto): Promise<Order> {
    return await this.ordersService.updateOrder(id, order);
  }
}
