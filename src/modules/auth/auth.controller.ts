import { Controller, Request, Post, UseGuards, Body, Get } from '@nestjs/common';
import { ServiceAccountDTO } from 'src/modules/auth/dto/service-account.dto';
import { AuthService } from './auth.service';
import { ServiceAccountGuard } from './guard/service-account.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST: auth/signin
   */

  @Post('signin')
  async signIn(@Body() serviceAccount: ServiceAccountDTO) {
    return this.authService.signIn(serviceAccount);
  }

  @UseGuards(ServiceAccountGuard)
  @Get('test')
  async test(@Request() req) {
    console.log(req.user);
    return 'OK';
  }
}
