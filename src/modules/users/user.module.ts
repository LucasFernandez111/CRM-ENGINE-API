import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';

import { User, UserSchema } from 'src/schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), forwardRef(() => AuthModule)],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
