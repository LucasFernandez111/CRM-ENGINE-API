import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ServiceAccountDTO } from 'src/modules/auth/dto/service-account.dto';

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
    console.log(payload);

    return payload;
  }
}
