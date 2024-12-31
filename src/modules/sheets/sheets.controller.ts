import { Controller, Get, UseGuards, Param, Req, Put, Body, HttpCode, Post, Request } from '@nestjs/common';
import { PayloadToken } from 'src/modules/auth/interfaces/payload-token.interface';
import { SheetService } from './sheet.service';
import { UpdateSheetDTO } from './dto/update-sheet.dto';
import { ServiceAccountGuard } from '../auth/guard/service-account.guard';

@Controller('sheet')
export class SheetsController {
  constructor(private readonly sheetProductsService: SheetService) {}

  @UseGuards(ServiceAccountGuard)
  @Get('/:spreadsheetId/menu')
  async getMenu(@Request() req, @Param('spreadsheetId') spreadsheetId: string) {
    return this.sheetProductsService.getMenu(req.user.serviceAccount, spreadsheetId);
  }
  @UseGuards(ServiceAccountGuard)
  @Get('/:spreadsheetId/products')
  async getProducts(@Request() req, @Param('spreadsheetId') spreadsheetId: string) {
    return await this.sheetProductsService.getProducts(req.user.serviceAccount, spreadsheetId);
  }
  @UseGuards(ServiceAccountGuard)
  @Get('/:spreadsheetId/shipments')
  async getShipments(@Request() req, @Param('spreadsheetId') spreadsheetId: string) {
    return await this.sheetProductsService.getShipments(req.user.serviceAccount, spreadsheetId);
  }

  @UseGuards(ServiceAccountGuard)
  @Put('/:spreadsheetId/:range')
  @HttpCode(200)
  async updateProductsForRange(
    @Request() req,
    @Param('spreadsheetId') spreadsheetId: string,
    @Param('range') range: string,
    @Body() newProducts: UpdateSheetDTO,
  ) {
    return await this.sheetProductsService.updateProductsForRange(
      req.user.serviceAccount,
      spreadsheetId,
      range,
      newProducts.values,
    );
  }
}
