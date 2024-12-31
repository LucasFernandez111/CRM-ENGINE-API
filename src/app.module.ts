import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ReportsModule } from './modules/reports/reports.module';
import { SheetsModule } from './modules/sheets/sheets.module';
import { StrategysModule } from './modules/strategys/strategys.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_CONNECT),
    AuthModule,
    StrategysModule,
    OrdersModule,
    SheetsModule,
    ReportsModule,
  ],
})
export class AppModule {}
