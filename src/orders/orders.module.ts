import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersSchema } from 'src/schemas/orders.schema';
import { UsersModule } from 'src/users/user.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: 'Orders', schema: OrdersSchema }]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
