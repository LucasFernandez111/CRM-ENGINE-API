import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.cookies['access_token'];

    if (!accessToken) {
      throw new UnauthorizedException('No access token found.');
    }

    const authClient = this.usersService.oauth2Client;

    try {
      authClient.setCredentials({ access_token: accessToken });

      const tokenInfo = await authClient.getTokenInfo(accessToken);
      if (tokenInfo.expiry_date && tokenInfo.expiry_date < Date.now()) {
        console.log('Access token has expired. Refreshing token...');

        const tokens = await authClient.refreshAccessToken();
        authClient.setCredentials(tokens.credentials);

        request.cookies['access_token'] = tokens.credentials.access_token;
      }

      request.user = {
        accessToken: authClient.credentials.access_token,
      };

      return true;
    } catch (error) {
      console.error('Error validating access token:', error.message);
      throw new UnauthorizedException('Invalid or expired access token.');
    }
  }
}
