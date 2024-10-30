import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard/jwt-auth.guard';
import { PayloadToken } from '../auth/interfaces/payload-token.interface';
import { UpdateUserDTO } from './dto';
import { UserExistsGuard } from './guards/user-exists.guard';
import { UsersService } from './services/user.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, UserExistsGuard)
  async getUser(@Req() req) {
    const { sub: idToken }: PayloadToken = req.user;

    return { user: await this.usersService.findUserByTokenId(idToken) };
  }

  @Put()
  @UseGuards(JwtAuthGuard, UserExistsGuard)
  async updateUser(@Req() req, @Body() updateUser: UpdateUserDTO) {
    const { sub: idToken }: PayloadToken = req.user;

    return await this.usersService.updateUser(idToken, updateUser);
  }
}
