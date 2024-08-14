import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { GoogleAuthService } from './auth/google-auth/google-auth.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule],
  controllers: [AuthController],
  providers: [GoogleAuthService],
})
export class AppModule {}
