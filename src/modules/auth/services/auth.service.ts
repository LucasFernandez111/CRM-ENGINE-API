import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ServiceAccountDTO } from '../dto/service-account.dto';
import { Credentials, JWT } from 'google-auth-library';

@Injectable()
export class AuthService {
  constructor(private readonly JWTService: JwtService) {}

  /**
   * Genera un JWT para un service account
   * @param serviceAccount
   * @returns JWT
   */
  public async generateJWTServiceAccount(serviceAccount: ServiceAccountDTO): Promise<string> {
    const serviceAccountObject: JWT = new JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const tokens: Credentials = await serviceAccountObject.authorize();

    const credentials = { ...tokens, email: serviceAccountObject.email };

    return this.JWTService.sign(credentials);
  }

  /**
   * Genera un JWT
   * @param payload
   * @returns JWT
   */
  public generateJWT(payload: any): string {
    return this.JWTService.sign(payload);
  }
}
