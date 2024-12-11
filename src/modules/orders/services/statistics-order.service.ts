import { Injectable } from '@nestjs/common';
import { OrderRepository } from './order-repository/order-repository.service';
import { Aggregate } from 'mongoose';
import { OrderTop } from '../interfaces/order-top.interface';
import ErrorManager from 'src/helpers/error.manager';

@Injectable()
export class StatisticsOrderService {
  constructor(private readonly ordersRepository: OrderRepository) {}

  /**
   * @param userID Campo por el cual machea
   * @throws Exception si no hay ordenes guardadas
   * @returns { Aggregate<OrderTop[] | []> }  Devuelve info. de la orden mas solicitada en general
   */
  public async getInfoTopOrder(userID: string): Promise<Aggregate<OrderTop>> {
    try {
      const infoTopOrder = await this.ordersRepository.getInfoTopOrder(userID);
      if (this.isEmpty(infoTopOrder)) throw new ErrorManager({ type: 'NOT_FOUND', message: 'No hay pedidos aun' });

      return infoTopOrder[0];
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /**
   * @param userID Campo por el cual machea
   * @throws Exception si no hay ordenes guardadas
   * @returns {Aggregate<OrderTop[] | []>} Devuelve info. de la orden mas solicitada de hoy
   */
  public async getInfoTopOrderToday(userID: string): Promise<Aggregate<OrderTop[] | []>> {
    try {
      return await this.ordersRepository.getInfoTopOrderToday(userID);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  private isEmpty<T>(array: Array<T>) {
    return !array.length;
  }
}
