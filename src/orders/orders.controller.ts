import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

import { Request } from 'express';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getOrders(
    @Req() req: Request,
    @Query('id_token') idtokenQuery: string,
  ) {
    const id_token = req.cookies['id_token'] || idtokenQuery;

    const orders = await this.ordersService.getOrders(id_token);

    return orders;
  }
  @Get(':id')
  async getOrder(@Param('id') order: string) {
    const id_token = 'g34mg23323f3434e342453ef3533434g';

    const orderFound = this.ordersService.getOrder(id_token, order);

    return orderFound;
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
  async deleteOrder(@Param('id') order: string) {
    const id_token = 'g34mg23323f3434e342453ef3533434g';

    const orderDeleted = await this.ordersService.deleteOrder(id_token, order);

    return orderDeleted;
  }
}
