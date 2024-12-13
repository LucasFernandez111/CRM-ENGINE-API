import { Order } from 'src/schemas/orders.schema';
import { UpdateOrderDto, CreateOrderDto } from '../dto';

/**
 * Interface repository for orders
 *
 * @extends IRepository<Order|CreateOrderDto|UpdateOrderDto>
 */
export interface IOrderRepository {
  findAllByUserId(userId: string): Promise<Order[]>;
}
