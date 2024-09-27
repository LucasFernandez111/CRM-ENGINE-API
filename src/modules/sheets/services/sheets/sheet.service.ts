import { Injectable, Scope } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import ErrorManager from 'src/config/error.manager';
import { UsersService } from 'src/modules/users/services/user.service';

@Injectable({ scope: Scope.REQUEST })
export class SheetService {
  public oauth2Client: OAuth2Client;
  constructor(private readonly userService: UsersService) {
    this.oauth2Client = new google.auth.OAuth2();
  }

  public async getProducts<T>(id_token: string, access_token: string): Promise<T[][]> {
    try {
      await this.oauth2Client.setCredentials({ access_token });
      console.log(await this.oauth2Client);
      // const sheetId = await this.findSheetId(id_token);
      const sheetId = '1qay0Xei1JZnILrRF8cNXmwyiL6X6JrPrUbFvOJgzXMk';
      return await this.getSheetData(sheetId, 'Sheet1!A:D');
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async getOauth() {
    return this.oauth2Client;
  }

  public async getSheetData(sheetId: string, range: string) {
    const response = await google.sheets('v4').spreadsheets.values.get({
      auth: this.oauth2Client,
      spreadsheetId: sheetId,
      range: range,
    });
    return response.data.values;
  }
  public async getStock() {}

  public async getCategory() {}

  private async findSheetId(id_token: string) {
    try {
      const { sheetId } = await this.userService.findUserByTokenId(id_token);
      if (!sheetId) return sheetId;
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
