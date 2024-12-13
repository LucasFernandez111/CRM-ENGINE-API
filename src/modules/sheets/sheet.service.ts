import { Injectable } from '@nestjs/common';
import { GoogleApiSheetService } from 'src/modules/sheets/google-api-sheet.service';
import { JWT } from 'google-auth-library';

export interface SheetMenu {
  category: string;
  subcategories: string[];
  prices: string[];
}
@Injectable()
export class SheetService {
  private RANGE_PRODUCTS_MENU = 'A2:D'; //Rango de sheet por defecto donde se colocan los productos en este sistema
  private RANGE_PRODUCTS_SHIPMENTS = 'I2:K';
  constructor(private readonly googleApiSheetService: GoogleApiSheetService) {}
  public async getMenu(credentialsServiceAccount: JWT, spreadsheetId: string): Promise<string[][]> {
    const sheetNames: string[] = await this.googleApiSheetService.getSheetNames(
      credentialsServiceAccount,
      spreadsheetId,
    );

    const range = `${sheetNames[0]}!${this.RANGE_PRODUCTS_MENU}`;

    return await this.googleApiSheetService.getSheetDataForRange(credentialsServiceAccount, spreadsheetId, range);
  }

  public async getProducts(credentialsServiceAccount: JWT, spreadsheetId: string) {
    const menu = await this.getMenu(credentialsServiceAccount, spreadsheetId);
    return this.getUnifiedCategories(menu);
  }

  public getCategories(menu: string[][]): string[] {
    const categories = menu.map((row) => row[0]);
    return this.deleteDuplicate(categories);
  }

  public async updateProductsForRange(
    credentialsServiceAccount: JWT,
    spreadsheetId: string,
    range: string,
    newProducts: string[][],
  ) {
    await this.googleApiSheetService.updateSheetForRange(credentialsServiceAccount, spreadsheetId, range, newProducts);
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

  public async getShipments(credentialsServiceAccount: JWT, spreadsheetId: string): Promise<string[][]> {
    const sheetNames: string[] = await this.googleApiSheetService.getSheetNames(
      credentialsServiceAccount,
      spreadsheetId,
    );

    const range = `${sheetNames[0]}!${this.RANGE_PRODUCTS_SHIPMENTS}`;

    return await this.googleApiSheetService.getSheetDataForRange(credentialsServiceAccount, spreadsheetId, range);
  }
}
