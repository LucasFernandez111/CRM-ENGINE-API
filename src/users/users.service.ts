import {
  HttpCode,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { google } from 'googleapis';
import { oauth2 } from 'googleapis/build/src/apis/oauth2';

@Injectable()
export class UsersService {
  public oauth2Client;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2();
  }

  async getProfile() {
    const { data } = await google.oauth2('v2').userinfo.get({
      auth: this.oauth2Client,
    });

    return data;
  }

  async getRows(spreadSheetId: string) {
    const response = await google.sheets('v4').spreadsheets.values.get({
      auth: this.oauth2Client,
      spreadsheetId: spreadSheetId,
      range: 'A:D',
    });

    const rows = response.data.values;
    return rows;
  }

  async updateRow(spreadSheetId: string, range: string, values: string[]) {
    if (!range || !values || !spreadSheetId)
      return new NotFoundException('Range or values not provided');

    if (values.length > 4)
      return new NotFoundException(`Range too long ${range.length}`);
    try {
      await google.sheets('v4').spreadsheets.values.update({
        auth: this.oauth2Client,
        spreadsheetId: spreadSheetId,
        range: range,
        valueInputOption: 'RAW',
        requestBody: {
          values: [values],
        },
      });
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }
}
