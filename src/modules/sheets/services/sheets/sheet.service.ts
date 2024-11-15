import { Injectable } from '@nestjs/common';
import { Credentials, OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import ErrorManager from 'src/config/error.manager';
import { UpdateSheetDto } from 'src/modules/users/dto/update-sheet.dto';

@Injectable()
export class SheetService {
  private oauth2Client: OAuth2Client;

  constructor() {}
  /**
   * Crea un cliente OAuth2 configurado con las credenciales proporcionadas
   */
  public getOauth2Client(credentials: Credentials): OAuth2Client {
    const oauth2Client = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: process.env.GOOGLE_REDIRECT_URI,
    });

    oauth2Client.setCredentials(credentials);
    return oauth2Client;
  }

  /**
   * Obtiene los títulos de las hojas de un documento de Google Sheets
   */
  public async getSheets(oauth2Client: OAuth2Client, spreadsheetId: string): Promise<string[]> {
    try {
      const { data } = await google.sheets({ version: 'v4', auth: oauth2Client }).spreadsheets.get({ spreadsheetId });

      return data.sheets?.map((sheet) => sheet.properties.title) ?? [];
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /**
   * Obtiene productos de la hoja de cálculo en las columnas A a D
   */
  public async getSheetProducts(oauth2Client: OAuth2Client, sheetId: string): Promise<any[]> {
    try {
      const titleSheets = await this.getSheets(oauth2Client, sheetId);

      const range = `${titleSheets[0]}!A:D`;
      return this.getSheetData(oauth2Client, sheetId, range);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /**
   * Obtiene los datos de una hoja de cálculo en el rango especificado
   */
  private async getSheetData(oauth2Client: OAuth2Client, spreadsheetId: string, range: string): Promise<any[]> {
    try {
      const { data } = await google.sheets({ version: 'v4', auth: oauth2Client }).spreadsheets.values.get({
        spreadsheetId,
        range,
      });
      return data.values ?? [];
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /**
   * Obtiene las categorías de la hoja de cálculo y elimina duplicados
   */
  public async getCategories(oauth2Client: OAuth2Client, spreadsheetId: string): Promise<string[]> {
    try {
      const titleSheet = await this.getSheets(oauth2Client, spreadsheetId);
      const range = `${titleSheet[0]}!A2:A`;
      const categories = (await this.getSheetData(oauth2Client, spreadsheetId, range)).flat();
      return this.removeDuplicates(categories);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /**
   * Obtiene las subcategorías de la hoja de cálculo
   */
  public async getSubcategories(oauth2Client: OAuth2Client, spreadsheetId: string): Promise<string[]> {
    try {
      const titleSheet = await this.getSheets(oauth2Client, spreadsheetId);
      const range = `${titleSheet[0]}!B2:B`;
      const categories = (await this.getSheetData(oauth2Client, spreadsheetId, range)).flat();
      return this.removeDuplicates(categories);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /**
   *
   * @param ouath2Client  Cliente OAuth2 configurado
   * @param range  rango de la hoja de cálculo a actualizar
   * @param sheetId  ID de la hoja de cálculo
   * @param rowsUpdated filas a actualizar
   */
  public async updateRowsSheet(
    ouath2Client: OAuth2Client,
    range: string,
    sheetId: string,
    rowsUpdated: UpdateSheetDto,
  ): Promise<void> {
    try {
      await google.sheets('v4').spreadsheets.values.update({
        auth: ouath2Client,
        spreadsheetId: sheetId,
        range,
        valueInputOption: 'RAW',
        requestBody: {
          values: rowsUpdated.values,
        },
      });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /**
   * Elimina elementos duplicados de un arreglo de categorías
   */
  private removeDuplicates(categories: string[]): string[] {
    return [...new Set(categories)];
  }
}
