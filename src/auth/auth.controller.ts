import { Controller, Get, Res, Req, UseGuards } from '@nestjs/common';
import { GoogleAuthService } from './google-auth/google-auth.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth(@Req() req) {
    // Passport redirige automáticamente a Google
  }

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  googleAuthCallback(@Req() req, @Res() res: Response) {
    // Aquí puedes manejar el resultado de la autenticación
    return res.send({ user: req.user });
  }
}
