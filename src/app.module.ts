import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/user.module';
import { OrdersModule } from './modules/orders/orders.module';

import { SheetsModule } from './modules/sheets/sheets.module';
import { ReportsModule } from './modules/reports/reports.module';
import { OAuth2Module } from './modules/o-auth2/o-auth2.module';
import { GoogleApiSheetModule } from './modules/google-api-sheet/google-api-sheet.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_CONNECT),
    AuthModule,
    UsersModule,
    OrdersModule,
    SheetsModule,
    OAuth2Module,
    GoogleApiSheetModule,
    ReportsModule,
  ],
})
export class AppModule {}
