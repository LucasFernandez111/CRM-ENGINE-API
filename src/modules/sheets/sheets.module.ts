import { Module } from '@nestjs/common';
import { SheetsController } from './controllers/sheets/sheets.controller';
import { SheetService } from './services/sheets/sheet.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [SheetsController],
  providers: [SheetService],
})
export class SheetsModule {}
