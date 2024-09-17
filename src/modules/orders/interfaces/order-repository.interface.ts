import { IRepository } from 'src/common/interfaces/repository.interface';
import { Order } from 'src/schemas/orders.schema';
import { UpdateOrderDto, CreateOrderDto } from '../dto';

/**
 * Interface repository for orders
 *
 * @extends IRepository<Order|CreateOrderDto|UpdateOrderDto>
 */
export interface IOrderRepository extends IRepository<Order, CreateOrderDto, UpdateOrderDto> {
  findAllByUserId(userId: string): Promise<Order[]>;
}
