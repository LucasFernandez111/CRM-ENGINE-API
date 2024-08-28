import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './user.service';
import { AccessTokenGuard } from './guards/access-token.guard';
import { UpdateSheetDto } from './dto/update-sheet.dto';
import { Request } from 'express';
import { DatabaseUsersService } from 'src/database/database-users/database-users.service';
import { UpdateUserDto } from './dto/update-user.dto';
@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly DatabaseUsersService: DatabaseUsersService,
  ) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  async getUserDb(@Req() req: Request) {
    const id_token = req.cookies['id_token'];

    const user = await this.DatabaseUsersService.getUser(id_token);

    return user;
  }

  @Put()
  @UseGuards(AccessTokenGuard)
  async updateUser(@Req() req: Request, @Body() userData: UpdateUserDto) {
    const id_token = req.cookies['id_token'];

    console.log('userData', userData);

    const userUpdate = await this.DatabaseUsersService.updateUser(
      id_token,
      userData,
    );

    return userUpdate;
  }

  @Get('profile')
  @UseGuards(AccessTokenGuard)
  async getProfile() {
    const profile = await this.usersService.getProfile();

    return { profile };
  }

  @Get('sheet')
  @UseGuards(AccessTokenGuard)
  async getRows() {
    const rows = await this.usersService.getRows(process.env.SPREAD_SHEET_ID);

    return { rows };
  }

  @Put('sheets/rows/update')
  @UseGuards(AccessTokenGuard)
  async updateRow(@Body() body: UpdateSheetDto) {
    const range: string = body.range;
    const values: string[] = body.values;

    await this.usersService.updateRow(
      process.env.SPREAD_SHEET_ID,
      range,
      values,
    );

    return {
      statusCode: 200,
      message: 'Row updated successfully',
    };
  }
}
