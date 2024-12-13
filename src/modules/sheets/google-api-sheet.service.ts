import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { JWT, OAuth2Client } from 'google-auth-library';
import ErrorManager from 'src/helpers/error.manager';

@Injectable()
export class GoogleApiSheetService {
  /**
   * Obtiene la informacion de una hoja de calculo de Google Sheets
   *
   * @param oAuth2Client  Cliente OAuth2 configurado
   * @param spreadsheetId  ID de la hoja de c lculo
   *
   * @returns Informacion de la hoja de clculo
   */
  public async getSheets(oAuth2Client: OAuth2Client, spreadsheetId: string) {
    try {
      const { data } = await google.sheets({ version: 'v4', auth: oAuth2Client }).spreadsheets.get({ spreadsheetId });
      return data.sheets;
    } catch (error) {
      console.log(error);

      throw ErrorManager.createSignatureError(
        new ErrorManager({ type: 'BAD_REQUEST', message: 'Error al obtener la hoja de calculo' }).message,
      );
    }
  }

  public async getSheetNames(client: OAuth2Client | JWT, spreadsheetId: string) {
    try {
      const sheets = await this.getSheets(client, spreadsheetId);

      const sheetNames = sheets.map((sheet) => sheet.properties.title);

      if (sheetNames.length === 0) {
        throw new ErrorManager({ type: 'NOT_FOUND', message: 'No se ha encontrado ninguna hoja de calculo' });
      }
      return sheetNames;
    } catch (error) {
      console.log(error);

      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async getSheetDataForRange(
    oAuth2Client: OAuth2Client,
    spreadsheetId: string,
    range: string,
  ): Promise<string[][]> {
    try {
      const sheetData = await google
        .sheets({ version: 'v4', auth: oAuth2Client })
        .spreadsheets.values.get({ spreadsheetId, range });

      if (sheetData.data.values.length === 0) throw new ErrorManager({ type: 'NOT_FOUND', message: 'Sheet sin datos' });
      return sheetData.data.values;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async updateSheetForRange(
    oAuth2Client: OAuth2Client,
    spreadsheetId: string,
    range: string,
    values: string[][],
  ): Promise<void> {
    try {
      await google.sheets({ version: 'v4', auth: oAuth2Client }).spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        requestBody: {
          values,
        },
      });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async getSheetForServiceAccount(spreadsheetId: string) {}
}
