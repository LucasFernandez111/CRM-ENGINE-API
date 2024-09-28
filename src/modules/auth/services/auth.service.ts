import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/schemas';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Creates JWT token
   * @returns JWT token
   */

  public generateJWT(user: Partial<User>) {
    const payload = {
      sub: user.id_token,
      refreshToken: user.refresh_token,
    };

    return this.singIn({
      payload,
      secret: process.env.JWT_SECRET,
      expires: process.env.JWT_EXPIRES,
    });
  }

  private singIn({ payload, secret, expires }: { payload: any; secret: string; expires: string }): string {
    return this.jwtService.sign(payload, { secret, expiresIn: expires });
  }
}
