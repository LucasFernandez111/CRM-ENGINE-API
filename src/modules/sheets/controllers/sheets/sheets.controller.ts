import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { SheetService } from '../../services/sheets/sheet.service';
import { AccessTokenGuard } from 'src/modules/auth/guards/access-token.guard';

@Controller('sheets')
export class SheetsController {
  constructor(private readonly sheetService: SheetService) {}

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  async getSheets(@Param('id') sheetId: string) {
    return await this.sheetService.getSheet(sheetId);
  }
}
