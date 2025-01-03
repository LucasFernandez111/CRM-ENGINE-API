import { Module, forwardRef } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from '../../schemas/orders.schema';
import { UsersModule } from '../users/user.module';
import { OrderRepository } from './services/order-repository/order-repository.service';
import { SalesStatisticsService } from './services/sales-statistics/sales-statistics.service';
import { OrdersService } from './services/orders.service';
import { DateFilterService } from './services/date-filter/date-filter.service';
import { AuthModule } from '../auth/auth.module';
import { StatisticsOrderService } from './services/statistics-order.service';

@Module({
  imports: [AuthModule, UsersModule, MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }])],
  controllers: [OrdersController],
  providers: [OrdersService, OrderRepository, DateFilterService, SalesStatisticsService, StatisticsOrderService],
  exports: [OrdersService, SalesStatisticsService, StatisticsOrderService],
})
export class OrdersModule {}
