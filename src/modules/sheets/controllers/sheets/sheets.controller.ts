import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { SheetService } from '../../services/sheets/sheet.service';
import { AccessTokenGuard } from 'src/modules/auth/guards/access-token.guard';
import { Request } from 'express';

@Controller('sheets')
export class SheetsController {
  constructor(private readonly sheetService: SheetService) {}

  @Get('products')
  @UseGuards(AccessTokenGuard)
  async getProducts(@Req() req: Request) {
    const id_token = req.cookies['id_token'];
    const access_token = req.cookies['access_token'];

    return await this.sheetService.getProducts(id_token, access_token);
  }
}
