import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/user.module';
import { OrdersModule } from './modules/orders/orders.module';

import { DatabaseModule } from './database/database.module';
import { DateModule } from './date/date.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_CONNECT),
    AuthModule,
    UsersModule,
    OrdersModule,
    DatabaseModule,
    DateModule,
  ],
})
export class AppModule {}
