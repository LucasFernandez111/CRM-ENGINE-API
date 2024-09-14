import { Order } from 'src/schemas/orders.schema';
export interface MonthlyOrders {
  month: number;
  orders: Order[];
}
