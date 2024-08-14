import { Controller, Get, Redirect, Query } from '@nestjs/common';
import { GoogleAuthService } from './google-auth/google-auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Get('google')
  @Redirect()
  googleAuth() {
    const authUrl: string = this.googleAuthService.getAuthUrl();
    return { url: authUrl, statusCode: 302 };
  }

  @Get('google/callback')
  async googleAuthRedirect(@Query('code') code: string) {
    const { tokens } = await this.googleAuthService.getTokens(code);
    return { tokens };
  }
}
