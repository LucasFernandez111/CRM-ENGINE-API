export interface PayloadToken {
  sub: string;
  accessToken: string;
  sheetId: string;
  iat?: number;
  exp?: number;
}
