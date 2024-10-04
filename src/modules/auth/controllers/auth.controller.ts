import { Controller, Get, Res, Req, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { GoogleOauthGuard } from '../guards/google-oauth.guard';
import { PayloadToken } from '../interfaces/payload-token.interface';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const jwt: PayloadToken = req.user;
    res.cookie('jwt_token', jwt, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60, // 1 hora
    });

    return res.redirect(`${process.env.CLIENT_URI}/auth/callback?token=${jwt}`);
  }
}
