import { Injectable, Scope } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { ErrorManager } from 'src/config/error.manager';
@Injectable({ scope: Scope.REQUEST })
export class SheetService {
  public oauth2Client: OAuth2Client;
  constructor() {
    this.oauth2Client = new google.auth.OAuth2();
  }

  public async getSheet<T>(sheetId: string): Promise<T[][]> {
    try {
      const { data } = await google.sheets('v4').spreadsheets.values.get({
        auth: this.oauth2Client,
        spreadsheetId: sheetId,
        range: 'A:D',
      });

      if (!data.values) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Rows not found',
        });
      }

      return data.values;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async updateSheet(sheetId: string, sheet: any) {
    if (sheet.values.length > 4) throw new ErrorManager({ type: 'BAD_REQUEST', message: 'Range too long' });
    try {
      await google.sheets('v4').spreadsheets.values.update({
        auth: this.oauth2Client,
        spreadsheetId: sheetId,
        range: sheet.range,
        valueInputOption: 'RAW',
        requestBody: {
          values: [sheet.values],
        },
      });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
