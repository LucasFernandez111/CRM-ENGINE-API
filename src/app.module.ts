import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SheetsModule } from './modules/sheets/sheets.module';
import { StrategysModule } from './modules/strategys/strategys.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_CONNECT),
    AuthModule,
    StrategysModule,
    // UsersModule,
    OrdersModule,
    SheetsModule,

    // ReportsModule,
  ],
})
export class AppModule {}
