import { Module } from '@nestjs/common';
import { SheetsController } from './controllers/sheets/sheets.controller';
import { SheetService } from './services/sheets/sheet.service';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/user.module';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [SheetsController],
  providers: [SheetService],
})
export class SheetsModule {}
