import { Module } from '@nestjs/common';
import { GoogleStrategy } from '../modules/auth/strategies/google.strategy';
import { UsersModule } from 'src/modules/users/user.module';

@Module({
  imports: [UsersModule],
  providers: [GoogleStrategy],
  exports: [GoogleStrategy],
})
export class CommonModule {}
