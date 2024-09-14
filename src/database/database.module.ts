import { Module } from '@nestjs/common';
import { DatabaseUsersService } from './database-users/database-users.service';
import { Users, UsersSchema } from '../schemas/users.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }])],
  providers: [DatabaseUsersService],
  exports: [DatabaseUsersService],
})
export class DatabaseModule {}
