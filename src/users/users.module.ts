import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UsersService } from './users.service';
import { UsersDbService } from './users-db.service';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersSchema } from 'src/schemas/users.schema';
import { AccessTokenGuard } from './guards/access-token.guard';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: 'Users',
        schema: UsersSchema,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersDbService, AccessTokenGuard],
  exports: [AccessTokenGuard, UsersService],
})
export class UsersModule {}
