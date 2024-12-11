import { Injectable } from '@nestjs/common';
import { Credentials, OAuth2Client, OAuth2ClientOptions } from 'google-auth-library';

@Injectable()
export class OAuth2Service {
  private oauthClientOptions: OAuth2ClientOptions;

  constructor() {
    this.oauthClientOptions = {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: process.env.GOOGLE_REDIRECT_URI,
    };
  }
  createOauth2Client(credentials: Credentials): OAuth2Client {
    const newOAuth2Client = new OAuth2Client(this.oauthClientOptions);
    newOAuth2Client.setCredentials(credentials);

    return newOAuth2Client;
  }
}
