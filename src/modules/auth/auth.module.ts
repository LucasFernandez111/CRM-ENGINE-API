import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GoogleAuthService } from './google-auth/google-auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [GoogleAuthService, GoogleStrategy, GoogleOauthGuard],
  exports: [GoogleAuthService, GoogleOauthGuard],
})
export class AuthModule {}
