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
    const { accessToken, id_token } = req.user;

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 100 * 60 * 1000,
    });
    res.cookie('id_token', id_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 100 * 60 * 1000,
    });

    return res.redirect(
      `http://localhost:3038/auth/callback?token=${accessToken}`,
    );
  }
}
