import { Module } from '@nestjs/common';
import { OAuth2Service } from './o-auth2.service';

@Module({
  providers: [OAuth2Service],
  exports: [OAuth2Service],
})
export class OAuth2Module {}
