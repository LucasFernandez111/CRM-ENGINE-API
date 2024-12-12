import { Controller, Get, Res, Req, UseGuards, Body, Post } from '@nestjs/common';

import { ServiceAccountDTO } from 'src/modules/auth/dto/service-account.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST: auth/signin
   */

  @Post('signin')
  async signIn(@Body() serviceAccount: ServiceAccountDTO) {
    return this.authService.generateJWTServiceAccount(serviceAccount);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('test')
  async test() {
    return 'OK';
  }
}
