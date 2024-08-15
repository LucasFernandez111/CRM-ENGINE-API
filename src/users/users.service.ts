import { Injectable } from '@nestjs/common';
import { google, sheets_v4 } from 'googleapis';

@Injectable()
export class UsersService {
  private sheets: sheets_v4.Sheets;
  public authClient;

  constructor() {
    this.sheets = google.sheets({ version: 'v4' });
    this.authClient = new google.auth.OAuth2();
  }

  async getRows(spreadSheetId: string) {
    const response = await this.sheets.spreadsheets.values.get({
      auth: this.authClient,
      spreadsheetId: spreadSheetId,
      range: 'A:D',
    });

    const rows = response.data.values;
    return rows;
  }
}
