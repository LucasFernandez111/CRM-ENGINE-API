import { Injectable } from '@nestjs/common';
import { GoogleApiSheetService } from 'src/modules/google-api-sheet/google-api-sheet.service';
import { JWT, OAuth2Client } from 'google-auth-library';
import { GoogleKeyServiceAccountDTO } from '../dto/google-key-service-account.dto';

export interface SheetMenu {
  category: string;
  subcategories: string[];
  prices: string[];
}
@Injectable()
export class SheetProductsService {
  private RANGE_PRODUCTS_MENU = 'A2:D'; //Rango de sheet por defecto donde se colocan los productos en este sistema
  private RANGE_PRODUCTS_SHIPMENTS = 'I2:K';
  constructor(private readonly googleApiSheetService: GoogleApiSheetService) {}
  public async getMenu(oAuth2Client: OAuth2Client | JWT, spreadsheetId: string): Promise<string[][]> {
    const sheetNames: string[] = await this.googleApiSheetService.getSheetNames(oAuth2Client, spreadsheetId);

    const range = `${sheetNames[0]}!${this.RANGE_PRODUCTS_MENU}`;

    return await this.googleApiSheetService.getSheetDataForRange(oAuth2Client, spreadsheetId, range);
  }

  public async getProducts(oAuth2Client: OAuth2Client, spreadsheetId: string) {
    const menu = await this.getMenu(oAuth2Client, spreadsheetId);
    return this.getUnifiedCategories(menu);
  }

  public getCategories(menu: string[][]): string[] {
    const categories = menu.map((row) => row[0]);
    return this.deleteDuplicate(categories);
  }

  public async updateProductsForRange(
    oAuth2Client: OAuth2Client,
    spreadsheetId: string,
    range: string,
    newProducts: string[][],
  ) {
    await this.googleApiSheetService.updateSheetForRange(oAuth2Client, spreadsheetId, range, newProducts);
  }
  private deleteDuplicate<T>(array: T[]) {
    return [...new Set(array)];
  }

  private async getUnifiedCategories(menu: string[][]): Promise<SheetMenu[]> {
    const categories: string[] = await this.getCategories(menu);

    //Unifica las categorias con su respectivo precio y subcategorias
    return categories.map((category) => {
      const subcategories: string[] = [];
      const prices: string[] = [];

      for (const row of menu) {
        if (row[0] === category) {
          subcategories.push(row[1]);
          prices.push(row[2]);
        }
      }

      return {
        category: category,
        subcategories: this.deleteDuplicate(subcategories),
        prices: this.deleteDuplicate(prices),
      };
    });
  }

  public async getMenuServiceAccount(
    serviceAccountKey: GoogleKeyServiceAccountDTO,
    spreadsheetId: string,
  ): Promise<string[][]> {
    const JWTClient = new JWT({
      email: serviceAccountKey.client_email,
      key: serviceAccountKey.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
      subject: serviceAccountKey.client_email,
    });

    return await this.getMenu(JWTClient, spreadsheetId);
  }

  public async getShipmentsServiceAccount(
    serviceAccountKey: GoogleKeyServiceAccountDTO,
    spreadsheetId: string,
  ): Promise<string[][]> {
    const JWTClient = new JWT({
      email: serviceAccountKey.client_email,
      key: serviceAccountKey.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
      subject: serviceAccountKey.client_email,
    });
    const sheetNames: string[] = await this.googleApiSheetService.getSheetNames(JWTClient, spreadsheetId);

    const range = `${sheetNames[0]}!${this.RANGE_PRODUCTS_SHIPMENTS}`;

    return await this.googleApiSheetService.getSheetDataForRange(JWTClient, spreadsheetId, range);
  }
}
