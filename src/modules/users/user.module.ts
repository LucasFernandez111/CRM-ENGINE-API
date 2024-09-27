import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersService } from './services/user.service';
import { UserRepositoryService } from './services/user-repository/user-repository.service';
import { User, UserSchema } from 'src/schemas';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [UsersService, UserRepositoryService],
  exports: [UsersService],
})
export class UsersModule {}
