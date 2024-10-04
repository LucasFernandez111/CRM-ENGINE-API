import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import ErrorManager from 'src/config/error.manager';
import { PayloadToken } from '../interfaces/payload-token.interface';

@Injectable()
export class AuthService {
  constructor() {}

  /**
   * Creates JWT token
   * @returns JWT token
   */

  public async signJWT(payload: PayloadToken): Promise<string> {
    return await this.generateJWT({
      payload,
      secret: process.env.JWT_SECRET,
      expires: process.env.JWT_EXPIRES,
    });
  }

  public async verifyJWT(token: string): Promise<jwt.JwtPayload | string | PayloadToken> {
    try {
      return (await jwt.verify(token, process.env.JWT_SECRET)) as jwt.JwtPayload;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
  private async generateJWT({
    payload,
    secret,
    expires,
  }: {
    payload: jwt.JwtPayload;
    secret: string;
    expires: string;
  }): Promise<string> {
    return await jwt.sign(payload, secret, { expiresIn: expires });
  }
}
