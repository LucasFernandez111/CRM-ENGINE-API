import { Injectable, Scope } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { TokenInfo } from 'google-auth-library/build/src/auth/oauth2client';
import { google } from 'googleapis';
import { ErrorManager } from 'src/config/error.manager';

@Injectable({ scope: Scope.REQUEST })
export class GoogleAuthService {
  private oauth2Client: OAuth2Client;
  private accessToken: string;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    });
  }

  public async setCredentials(accessToken: string, refreshToken: string): Promise<void> {
    this.oauth2Client.setCredentials({ access_token: accessToken, refresh_token: refreshToken });
    this.accessToken = accessToken;
  }

  public async getTokenInfo(): Promise<TokenInfo> {
    return this.oauth2Client.getTokenInfo(this.accessToken);
  }
  public async getAccessToken(): Promise<string> {
    return this.accessToken;
  }

  public async isExpiredToken(): Promise<boolean> {
    const tokenInfo = await this.getTokenInfo();
    return tokenInfo.expiry_date < Date.now();
  }

  public async refreshAccessToken(): Promise<void> {
    try {
      const { credentials } = await this.oauth2Client.refreshAccessToken();
      this.accessToken = credentials.access_token; // Actualiza el access token
    } catch (error) {
      throw new ErrorManager({ type: 'UNAUTHORIZED', message: 'Failed to refresh access token' });
    }
  }

  public async isTokenValid(idToken: string): Promise<boolean> {
    return Boolean(await this.oauth2Client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID }));
  }
}
