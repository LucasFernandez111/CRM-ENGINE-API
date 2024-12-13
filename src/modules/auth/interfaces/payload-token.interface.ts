import { Credentials } from 'google-auth-library';

export interface PayloadToken {
  sub: string;
  accessToken: string;
  sheetId: string;
  iat?: number;
  exp?: number;
}

export interface JWTPayloadToken extends Credentials {
  email: string;
}
