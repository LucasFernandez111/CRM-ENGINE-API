import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express'; // Asegúrate de importar Request
import { UsersService } from './services/user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard/jwt-auth.guard';
import { UserExistsGuard } from './guards/user-exists.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, UserExistsGuard)
  async getUser(@Req() req) {
    const id_token = req.user.sub;

    return await this.usersService.findUserByTokenId(id_token);
  }
}
