import { Controller, Get, Req, UseGuards, Param, Body, Post, Put } from '@nestjs/common';
import { SheetService } from '../../services/sheets/sheet.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth-guard/jwt-auth.guard';
import { PayloadToken } from 'src/modules/auth/interfaces/payload-token.interface';
import ErrorManager from 'src/config/error.manager';

@Controller('sheets')
export class SheetsController {
  constructor(private readonly sheetService: SheetService) {}

  @Get('products/:sheetId')
  @UseGuards(JwtAuthGuard)
  async getProducts(@Req() req, @Param('sheetId') sheetId: string) {
    const { sub: id_token, accessToken: access_token }: PayloadToken = req.user;

    if (!sheetId) {
      throw ErrorManager.createSignatureError(
        new ErrorManager({ type: 'UNAUTHORIZED', message: 'ID sheet not found' }).message,
      );
    }
    const ouath2Client = this.sheetService.getOauth2Client({ id_token, access_token });
    return {
      products: await this.sheetService.getSheetProducts(ouath2Client, sheetId),
    };
  }

  @Put('products/:sheetId/:range')
  @UseGuards(JwtAuthGuard)
  async getProduct(@Req() req, @Body() updatedRows, @Param('sheetId') sheetId: string, @Param('range') range: string) {
    const { sub: id_token, accessToken: access_token }: PayloadToken = req.user;

    if (!sheetId) {
      throw ErrorManager.createSignatureError(
        new ErrorManager({ type: 'UNAUTHORIZED', message: 'ID sheet not found' }).message,
      );
    }
    const ouath2Client = this.sheetService.getOauth2Client({ id_token, access_token });

    return await this.sheetService.updateRowsSheet(ouath2Client, range, sheetId, updatedRows);
  }

  @Get('products/categories/:sheetId')
  @UseGuards(JwtAuthGuard)
  async getCategory(@Req() req, @Param('sheetId') sheetId: string) {
    const { sub: id_token, accessToken: access_token } = req.user;

    const ouath2Client = this.sheetService.getOauth2Client({ id_token, access_token });

    if (!sheetId) {
      throw ErrorManager.createSignatureError(
        new ErrorManager({ type: 'UNAUTHORIZED', message: 'ID sheet not found' }).message,
      );
    }

    const categories = await this.sheetService.getCategories(ouath2Client, sheetId);
    const subcategories = await this.sheetService.getSubcategories(ouath2Client, sheetId);

    return {
      categories,
      subcategories,
    };
  }
}
