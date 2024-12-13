import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ServiceAccountDTO } from 'src/modules/auth/dto/service-account.dto';
import { AuthService } from 'src/modules/auth/auth.service';
import { JWT } from 'google-auth-library';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: 'nose',
    });
  }

  async validate(payload: ServiceAccountDTO) {
    return {
      serviceAccount: new JWT({
        email: payload.client_email,
        key: payload.private_key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        subject: payload.client_email,
      }),
    };
  }
}
