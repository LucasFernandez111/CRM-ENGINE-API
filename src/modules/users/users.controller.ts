import { Body, Controller, Get, Put, Request, UseGuards } from '@nestjs/common';
import { ServiceAccountGuard } from '../auth/guard/service-account.guard';
import { UserService } from './user.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(ServiceAccountGuard)
  @Get()
  async getUser(@Request() req) {
    return await this.userService.findUserByEmail(req.user.serviceAccount.email);
  }

  @UseGuards(ServiceAccountGuard)
  @Put()
  async updateUser(@Request() req, @Body() updatedUser: any) {
    return await this.userService.update(req.user.serviceAccount.email, updatedUser);
  }
}
