import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { GoogleAuthService } from './google-auth/google-auth.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { AccessTokenGuard } from './guards/access-token.guard';
import { GoogleStrategy } from './strategies/google.strategy';
import { UsersModule } from '../users/user.module';

@Module({
  imports: [forwardRef(() => UsersModule)],
  controllers: [AuthController],
  providers: [GoogleAuthService, GoogleStrategy, GoogleOauthGuard, AccessTokenGuard],
  exports: [GoogleAuthService, GoogleOauthGuard, AccessTokenGuard],
})
export class AuthModule {}
