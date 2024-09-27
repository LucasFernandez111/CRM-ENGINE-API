import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './services/user.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
