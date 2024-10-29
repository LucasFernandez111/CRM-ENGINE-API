import { Injectable } from '@nestjs/common';
import { OrderRepository } from './order-repository/order-repository.service';
import { Order } from 'src/schemas';
import ErrorManager from 'src/config/error.manager';

@Injectable()
export class StatisticsOrderService {
  constructor(private readonly ordersRepository: OrderRepository) {}

  public async getTopOrder(userID: string) {
    try {
      console.log(await this.ordersRepository.findTopOrden());
      return 0;
    } catch (error) {
      throw new ErrorManager(error);
    }
  }

  public getTopPriceOrder() {}
}
