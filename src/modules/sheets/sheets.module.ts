import { Module } from '@nestjs/common';
import { SheetsController } from './sheets.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/user.module';
import { SheetService } from './sheet.service';
import { GoogleApiSheetService } from './google-api-sheet.service';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [SheetsController],
  providers: [SheetService, GoogleApiSheetService],
})
export class SheetsModule {}
