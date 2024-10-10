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
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { Order } from '../../../schemas/orders.schema';
import { UpdateOrderDto, CreateOrderDto } from '../dto';
import { OrdersService } from '../services/orders.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth-guard/jwt-auth.guard';
import { UserExistsGuard } from 'src/modules/users/guards/user-exists.guard';
import { PayloadToken } from 'src/modules/auth/interfaces/payload-token.interface';
import { GeneratePDFService } from 'src/modules/generate/generate.service';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import { Response } from 'express';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly generateService: GeneratePDFService,
  ) {}

  @Get('pdf')
  getOrderPDF(@Res() res: Response) {
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="report.pdf"',
    });

    const docPDF = this.generateService.getReportPDF(res);

    docPDF.end();
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
}
