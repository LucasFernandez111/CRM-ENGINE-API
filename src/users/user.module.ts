import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UsersService } from './user.service';
import { AccessTokenGuard } from './guards/access-token.guard';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService, AccessTokenGuard],
  exports: [AccessTokenGuard, UsersService],
})
export class UsersModule {}