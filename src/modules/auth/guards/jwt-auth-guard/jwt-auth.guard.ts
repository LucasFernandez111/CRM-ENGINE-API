import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { AuthService } from '../../services/auth.service';
import { PayloadToken } from '../../interfaces/payload-token.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = req.cookies['jwt_token'];

    if (!token) {
      throw new HttpException('Unauthorized', 401);
    }

    const payload: PayloadToken = (await this.authService.verifyJWT(token)) as PayloadToken;

    if (!payload || !payload.sub || !payload.accessToken) throw new HttpException('Unauthorized', 401);

    req.user = payload;

    return true;
  }
}
