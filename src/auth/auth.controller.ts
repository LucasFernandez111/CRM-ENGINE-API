import { Controller, Get, Res, Req, UseGuards } from '@nestjs/common';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { Response } from 'express';
import { DatabaseUsersService } from 'src/database/database-users/database-users.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly DatabaseUsersService: DatabaseUsersService) {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    // Aquí puedes manejar el resultado de la autenticación
    const { accessToken, id_token } = req.user;

    const user = await this.DatabaseUsersService.getUser(id_token);

    if (!user) await this.DatabaseUsersService.createUser(req.user);

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
      `${process.env.CLIENT_URI}/auth/callback?token=${accessToken}`,
    );
  }
}
