import { Module } from '@nestjs/common';
import { OrdersController } from './controllers/orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from '../../schemas/orders.schema';
import { UsersModule } from '../users/user.module';
import { OrderRepository } from './services/order-repository/order-repository.service';
import { SalesStatisticsService } from './services/sales-statistics/sales-statistics.service';
import { OrdersService } from './services/orders.service';
import { DateFilterService } from './services/date-filter/date-filter.service';
import { OrdersStatisticsController } from './controllers/orders-statistics.controller';

@Module({
  imports: [UsersModule, MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }])],
  controllers: [OrdersController, OrdersStatisticsController],
  providers: [OrdersService, OrderRepository, DateFilterService, SalesStatisticsService],
  exports: [OrdersService],
})
export class OrdersModule {}
