import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../../services/auth.service';
import ErrorManager from 'src/config/error.manager';
import { PayloadToken } from '../../interfaces/payload-token.interface';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const token = req.cookies['jwt_token'];

    if (!token)
      throw ErrorManager.createSignatureError(
        new ErrorManager({ type: 'UNAUTHORIZED', message: 'Token not found' }).message,
      );

    const payload: PayloadToken = (await this.authService.verifyJWT(token)) as PayloadToken;

    if (!payload || !payload.sub || !payload.accessToken)
      throw ErrorManager.createSignatureError(
        new ErrorManager({ type: 'UNAUTHORIZED', message: 'Incomplete token' }).message,
      );

    req.user = payload;

    return true;
  }
}
