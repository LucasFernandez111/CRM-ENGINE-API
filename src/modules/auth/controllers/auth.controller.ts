import { Controller, Get, Res, Req, UseGuards } from '@nestjs/common';

import { Response } from 'express';
import { GoogleOauthGuard } from '../guards/google-oauth.guard';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const { accessToken, id_token, refreshToken } = req.user;
    console.log(refreshToken);

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
    return res.json({
      status: 'success',
      id_token,
      accessToken,
      refreshToken,
    });

    // return res.redirect(`${process.env.CLIENT_URI}/auth/callback?token=${accessToken}`);
  }
}
