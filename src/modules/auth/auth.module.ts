import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { GoogleAuthService } from './google-auth/google-auth.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { GoogleStrategy } from './strategies/google.strategy';
import { UsersModule } from '../users/user.module';
import { AuthService } from './services/auth.service';
import { JwtAuthGuard } from './guards/jwt-auth-guard/jwt-auth.guard';

@Module({
  imports: [forwardRef(() => UsersModule)],
  controllers: [AuthController],
  providers: [GoogleAuthService, GoogleStrategy, GoogleOauthGuard, JwtAuthGuard, AuthService],
  exports: [GoogleAuthService, GoogleOauthGuard, JwtAuthGuard, AuthService],
})
export class AuthModule {}
