import { Controller, Req, Get, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { AccessTokenGuard } from './guards/access-token.guard';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('sheet')
  @UseGuards(AccessTokenGuard)
  async getRows(@Req() req: Request) {
    const rows = await this.usersService.getRows(process.env.SPREAD_SHEET_ID);

    return { rows };
  }
}
