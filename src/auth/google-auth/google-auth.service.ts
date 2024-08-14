import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { TokenResponse } from 'google-auth-library/build/src/auth/impersonated';
import { GetTokenResponse } from 'google-auth-library/build/src/auth/oauth2client';

@Injectable()
export class GoogleAuthService {
  private oauth2Client: OAuth2Client;
  constructor() {
    this.oauth2Client = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirectUri: process.env.GOOGLE_REDIRECT_URI as string,
    });
  }

  getAuthUrl(): string {
    const authUrl: string = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/userinfo.profile'],
    });
    return authUrl;
  }

  async getTokens(code: string) {
    const tokens: GetTokenResponse = await this.oauth2Client.getToken(code);

    return tokens;
  }
}
