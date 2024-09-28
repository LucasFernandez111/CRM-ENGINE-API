import { Injectable } from '@nestjs/common';
import { User } from 'src/schemas';
import * as jwt from 'jsonwebtoken';

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
      refreshToken: user.refresh_token,
    };

    return await this.generateJWT({
      payload,
      secret: process.env.JWT_SECRET,
      expires: process.env.JWT_EXPIRES,
    });
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
