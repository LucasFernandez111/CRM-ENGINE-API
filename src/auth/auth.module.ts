import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GoogleAuthService } from './google-auth/google-auth.service';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  controllers: [AuthController],
  providers: [GoogleAuthService, GoogleStrategy],
  exports: [GoogleAuthService],
})
export class AuthModule {}
