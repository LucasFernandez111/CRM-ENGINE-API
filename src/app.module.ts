import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/user.module';
import { OrdersModule } from './orders/orders.module';

import { DatabaseModule } from './database/database.module';
import { StatisticsModule } from './statistics/statistics.module';
import { DateModule } from './date/date.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_CONNECT),
    AuthModule,
    UsersModule,
    OrdersModule,
    DatabaseModule,
    StatisticsModule,
    DateModule,
  ],
})
export class AppModule {}
