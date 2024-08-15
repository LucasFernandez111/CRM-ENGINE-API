import { Controller, Get, Res, Req, UseGuards } from '@nestjs/common';
import { GoogleAuthService } from './google-auth/google-auth.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  googleAuthCallback(@Req() req, @Res() res: Response) {
    // Aquí puedes manejar el resultado de la autenticación

    res.cookie('access_token', req.user.accessToken, {
      httpOnly: true,
      secure: false,
      path: '/',
    });
    res.cookie('refresh_token', req.user.refreshToken, {
      httpOnly: true,
      secure: false,
    });

    return res.redirect('/users/sheet');
  }
}
