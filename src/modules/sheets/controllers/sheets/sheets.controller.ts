import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { SheetService } from '../../services/sheets/sheet.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth-guard/jwt-auth.guard';
import { PayloadToken } from 'src/modules/auth/interfaces/payload-token.interface';

@Controller('sheets')
export class SheetsController {
  constructor(private readonly sheetService: SheetService) {}

  @Get('products')
  @UseGuards(JwtAuthGuard)
  async getProducts(@Req() req) {
    const { sub: id_token, accessToken: access_token }: PayloadToken = req.user;

    const ouath2Client = this.sheetService.getOauth2Client({ id_token, access_token });

    return {
      products: await this.sheetService.getSheetProducts(ouath2Client, '1qay0Xei1JZnILrRF8cNXmwyiL6X6JrPrUbFvOJgzXMk'),
    };
  }

  @Get('products/categories')
  @UseGuards(JwtAuthGuard)
  async getCategory(@Req() req) {
    const { sub: id_token, accessToken: access_token } = req.user;
    const ouath2Client = this.sheetService.getOauth2Client({ id_token, access_token });

    const sheetId = '1qay0Xei1JZnILrRF8cNXmwyiL6X6JrPrUbFvOJgzXMk';

    const categories = await this.sheetService.getCategories(ouath2Client, sheetId);
    const subcategories = await this.sheetService.getSubcategories(ouath2Client, sheetId);

    return {
      categories,
      subcategories,
    };
  }
}
