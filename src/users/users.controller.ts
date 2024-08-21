import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AccessTokenGuard } from './guards/access-token.guard';
import { UpdateSheetDto } from './dto/update-sheet.dto';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
