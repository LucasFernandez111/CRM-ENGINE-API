import { Injectable } from '@nestjs/common';
import { User } from 'src/schemas';
import * as jwt from 'jsonwebtoken';
import ErrorManager from 'src/config/error.manager';

@Injectable()
export class AuthService {
  constructor() {}

  /**
   * Creates JWT token
   * @returns JWT token
   */

  public async signJWT(user: Partial<User>) {
    const payload = {
      sub: user.id_token,
    };

    return await this.generateJWT({
      payload,
      secret: process.env.JWT_SECRET,
      expires: process.env.JWT_EXPIRES,
    });
  }

  public async verifyJWT(token: string): Promise<jwt.JwtPayload | string> {
    try {
      await jwt.verify(token, process.env.JWT_SECRET);
      return await jwt.decode(token);
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
