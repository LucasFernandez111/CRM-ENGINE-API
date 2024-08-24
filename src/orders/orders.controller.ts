import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getOrders() {
    return 'orders';
  }
  @Get(':id')
  getOrder() {
    return 'order';
  }

  @Post()
  async createOrder(@Body() order: CreateOrderDto) {
    const orderCreated = await this.ordersService.createOrder(order);
    return {
      orderCreated,
    };
  }

  @Put()
  updateOrder() {
    return 'update order';
  }

  @Delete(':id')
  deleteOrder() {
    return 'delete order';
  }

  @Get('/users/:userId/orders')
  getUserOrders() {
    return 'user orders';
  }
}
