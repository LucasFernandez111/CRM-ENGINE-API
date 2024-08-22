import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UsersService } from './users.service';
import { UsersDbService } from './users-db.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersSchema } from 'src/schemas/users.schema';

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
  providers: [UsersService, UsersDbService],
})
export class UsersModule {}
