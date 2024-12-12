import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GoogleAuthService } from './google-auth/google-auth.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { GoogleStrategy } from './strategies/google.strategy';
import { UsersModule } from '../users/user.module';
import { AuthService } from './services/auth.service';
import { JwtAuthGuard } from './guards/jwt-auth-guard/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { StrategysModule } from '../strategys/strategys.module';

@Module({
  imports: [
    StrategysModule,
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: 'nose',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [GoogleAuthService, GoogleStrategy, GoogleOauthGuard, JwtAuthGuard, AuthService],
  exports: [GoogleAuthService, GoogleOauthGuard, JwtAuthGuard, AuthService],
})
export class AuthModule {}
