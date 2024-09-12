import { Body, Controller, Delete, Get, Param, Post, Query, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

import { Request } from 'express';
import { Order } from 'src/schemas/orders.schema';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * Obtener órdenes basadas en un rango de fechas.
   *
   * @param startDate - La fecha de inicio del rango (formato YYYY-MM-DD).
   * @param endDate - La fecha de fin del rango (formato YYYY-MM-DD).
   * @param req - El objeto de solicitud HTTP que contiene las cookies.
   * @returns Una lista de órdenes que fueron creadas dentro del rango de fechas especificado.
   *
   * Este endpoint devuelve órdenes creadas dentro del rango de fechas especificado.
   * El `id_token` se extrae de las cookies para autenticar la solicitud.
   * Las fechas deben proporcionarse en formato `YYYY-MM-DD`.
   */
  // @Get('range')
  // async getRecordsByDateRange(
  //   @Query('startDate') startDate: string,
  //   @Query('endDate') endDate: string,
  //   @Req() req: Request,
  // ): Promise<Order[] | []> {
  //   const id_token = req.cookies['id_token'];

  //   const startDateRange = new Date(startDate);
  //   const endDateRange = new Date(endDate);

  //   startDateRange.setUTCHours(0, 0, 0, 0);
  //   endDateRange.setUTCHours(23, 59, 59, 999);

  //   const records = await this.ordersService.getRecordsByDateRange(id_token, startDateRange, endDateRange);
  //   return records;
  // }

  /**
   * Obtener todas las órdenes asociadas con el usuario autenticado.
   *
   * @param req - El objeto de solicitud HTTP que contiene las cookies.
   * @returns Una lista de órdenes asociadas con el `id_token` proporcionado.
   *
   * Este endpoint devuelve todas las órdenes asociadas con el usuario autenticado.
   * El `id_token` se extrae de las cookies o del parámetro de consulta como alternativa.
   */
  @Get()
  async getOrders(@Req() req: Request): Promise<Order[] | []> {
    const id_token = req.cookies['id_token'];

    const orders = await this.ordersService.getOrders(id_token);
    return orders;
  }
  /**
   * Obtener una orden específica por su ID.
   *
   * @param id - El ID de la orden que se desea obtener.
   * @param req - El objeto de solicitud HTTP que contiene las cookies.
   * @returns Los detalles de la orden especificada si se encuentra.
   *
   * Este endpoint devuelve los detalles de una orden específica identificada por su ID.
   * El `id_token` se extrae de las cookies para autenticar la solicitud.
   */
  @Get(':id')
  async getOrderById(@Param('id') order: string, @Req() req: Request): Promise<Order | []> {
    const id_token = req.cookies['id_token'];
    const orderFound = this.ordersService.getOrderById(id_token, order);
    return orderFound;
  }

  /**
   * Crear una nueva orden.
   *
   * @param order - Los datos para la nueva orden.
   * @returns El objeto de la orden creada.
   *
   * Este endpoint crea una nueva orden con los datos proporcionados.
   * Los datos deben coincidir con la estructura definida en `CreateOrderDto`.
   */
  @Post()
  async createOrder(@Body() order: CreateOrderDto, @Req() req: Request): Promise<Order | []> {
    const userId = req.cookies['id_token'];

    const orderCreated = await this.ordersService.createOrder(userId, order);
    return orderCreated;
  }

  /**
   * Eliminar una orden por su ID.
   *
   * @param orderId - El ID de la orden que se desea eliminar.
   * @param req - El objeto de solicitud HTTP que contiene las cookies.
   * @returns Un mensaje de confirmación o los detalles de la orden eliminada.
   *
   * Este endpoint elimina una orden identificada por su ID.
   * El `id_token` se extrae de las cookies para autenticar la solicitud.
   */
  @Delete(':id')
  async deleteOrderById(@Param('id') orderId: number, @Req() req: Request): Promise<Order | []> {
    const id_token = req.cookies['id_token'];
    return this.ordersService.deleteOrderById(id_token, orderId);
  }
}
