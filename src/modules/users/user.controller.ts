import { Body, Controller, Get, Put, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard/jwt-auth.guard';
import { PayloadToken } from '../auth/interfaces/payload-token.interface';
import { UpdateUserDTO } from './dto';
import { UserExistsGuard } from './guards/user-exists.guard';
import { UsersService } from './services/user.service';
import { AuthService } from '../auth/services/auth.service';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  // constructor(
  //   private readonly usersService: UsersService,
  //   private readonly authService: AuthService,
  // ) {}
  // @Get()
  // @UseGuards(JwtAuthGuard, UserExistsGuard)
  // async getUser(@Req() req) {
  //   const { sub: idToken }: PayloadToken = req.user;
  //   return { user: await this.usersService.findUserByTokenId(idToken) };
  // }
  // @Put()
  // @UseGuards(JwtAuthGuard, UserExistsGuard)
  // async updateUser(@Res() res: Response, @Req() req, @Body() updateUser: UpdateUserDTO) {
  //   const { iat, exp, ...payloadTokenRequest }: PayloadToken = req.user;
  //   const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
  //   const remainingTime = (exp - currentTime) * 1000; // Tiempo restante en milisegundos
  //   const userUpdated = await this.usersService.updateUser(payloadTokenRequest.sub, updateUser);
  //   const newPayload: PayloadToken = { ...payloadTokenRequest, sheetId: userUpdated.sheetId };
  //   const newToken = await this.authService.signJWT(newPayload);
  //   res.clearCookie('jwt_token');
  //   res.cookie('jwt_token', newToken, {
  //     httpOnly: true,
  //     secure: true,
  //     sameSite: 'none',
  //     maxAge: remainingTime,
  //   });
  //   return res.status(200).send('OK');
  // }
}
