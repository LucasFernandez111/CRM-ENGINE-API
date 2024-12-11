import { Module } from '@nestjs/common';
import { SheetsController } from './sheets.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/user.module';
import { SheetProductsService } from './services/sheet-products.service';
import { GoogleApiSheetModule } from '../google-api-sheet/google-api-sheet.module';
import { OAuth2Module } from '../o-auth2/o-auth2.module';

@Module({
  imports: [AuthModule, UsersModule, GoogleApiSheetModule, OAuth2Module],
  controllers: [SheetsController],
  providers: [SheetProductsService],
})
export class SheetsModule {}
