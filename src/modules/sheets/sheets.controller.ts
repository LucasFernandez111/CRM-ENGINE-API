import { Controller, Get, UseGuards, Param, Req, Put, Body, HttpCode, Post } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth-guard/jwt-auth.guard';
import { PayloadToken } from 'src/modules/auth/interfaces/payload-token.interface';
import { OAuth2Service } from '../o-auth2/o-auth2.service';
import { SheetProductsService } from './services/sheet-products.service';
import { UpdateSheetDTO } from './dto/update-sheet.dto';
import { GoogleKeyServiceAccountDTO } from './dto/google-key-service-account.dto';

@Controller('sheet')
export class SheetsController {
  constructor(
    private readonly sheetProductsService: SheetProductsService,
    private readonly oAuth2Service: OAuth2Service,
  ) {}

  @Get('/:spreadsheetId/menu')
  @UseGuards(JwtAuthGuard)
  async getMenu(@Req() req, @Param('spreadsheetId') spreadsheetId: string) {
    const { sub: id_token, accessToken: access_token }: PayloadToken = req.user;
    const oAuth2Client = this.oAuth2Service.createOauth2Client({ id_token, access_token });

    return await this.sheetProductsService.getMenu(oAuth2Client, spreadsheetId);
  }

  @Get('/:spreadsheetId/products')
  @UseGuards(JwtAuthGuard)
  async getProducts(@Req() req, @Param('spreadsheetId') spreadsheetId: string) {
    const { sub: id_token, accessToken: access_token }: PayloadToken = req.user;
    const oAuth2Client = this.oAuth2Service.createOauth2Client({ id_token, access_token });

    return await this.sheetProductsService.getProducts(oAuth2Client, spreadsheetId);
  }

  @Post('service-account/:spreadsheetId/menu')
  async getMenuServiceAccount(@Param('spreadsheetId') spreadsheetId: string, @Body() serviceAccountKey: any) {
    return await this.sheetProductsService.getMenuServiceAccount(serviceAccountKey, spreadsheetId);
  }

  @Post('service-account/:spreadsheetId/shipments')
  async getShipmentsServiceAccount(@Param('spreadsheetId') spreadsheetId: string, @Body() serviceAccountKey: any) {
    return await this.sheetProductsService.getShipmentsServiceAccount(serviceAccountKey, spreadsheetId);
  }

  @Put('/:spreadsheetId/:range')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async updateProductsForRange(
    @Req() req,
    @Param('spreadsheetId') spreadsheetId: string,
    @Param('range') range: string,
    @Body() newProducts: UpdateSheetDTO,
  ) {
    const { sub: id_token, accessToken: access_token }: PayloadToken = req.user;

    const oAuth2Client = this.oAuth2Service.createOauth2Client({ id_token, access_token });
    return await this.sheetProductsService.updateProductsForRange(
      oAuth2Client,
      spreadsheetId,
      range,
      newProducts.values,
    );
  }
}
