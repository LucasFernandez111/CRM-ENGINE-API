import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import ErrorManager from 'src/config/error.manager';
import { GoogleAuthService } from '../google-auth/google-auth.service';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const response = context.switchToHttp().getResponse();

      const accessToken = request.cookies['access_token'];

      // const refreshToken = request.cookies['refresh_token'];

      // if (!accessToken || !refreshToken) {
      //   throw new ErrorManager({
      //     type: 'UNAUTHORIZED',
      //     message: 'Access token o refresh token not found',
      //   });
      // }
      if (!accessToken) {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'Access token o refresh token not found',
        });
      }

      await this.googleAuthService.setCredentials(accessToken);

      // const isExpiredToken = await this.googleAuthService.isExpiredToken();
      // if (isExpiredToken) {
      //   await this.googleAuthService.refreshAccessToken();
      //   const newAccessToken = await this.googleAuthService.getAccessToken();
      //   response.cookie('access_token', newAccessToken, {
      //     httpOnly: true,
      //     secure: process.env.NODE_ENV === 'production',
      //     maxAge: 3600000,
      //   });
      // }
      return true;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
