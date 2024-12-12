import { Module } from '@nestjs/common';
import { JwtStrategy } from './jwtstrategy/jwtstrategy.service';

@Module({
  providers: [JwtStrategy],
  exports: [JwtStrategy],
})
export class StrategysModule {}
