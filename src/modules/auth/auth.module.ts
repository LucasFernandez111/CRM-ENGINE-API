import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { StrategysModule } from '../strategys/strategys.module';
import { UsersModule } from '../users/user.module';

@Module({
  imports: [
    StrategysModule,
    UsersModule,
    JwtModule.register({
      secret: 'nose',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
