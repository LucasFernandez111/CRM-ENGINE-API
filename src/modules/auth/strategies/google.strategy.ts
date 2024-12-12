import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UsersService } from 'src/modules/users/services/user.service';
import { AuthService } from '../services/auth.service';
import { PayloadToken } from '../interfaces/payload-token.interface';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
      prompt: 'consent',
      scope: ['email', 'profile', 'https://www.googleapis.com/auth/spreadsheets'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<void> {
    const { name, emails, photos } = profile;

    const userProfile = {
      id_token: profile?.id,
      email: emails[0]?.value,
      firstName: name?.givenName,
      lastName: name?.familyName,
      picture: photos[0]?.value,
      refresh_token: refreshToken,
      accessToken,
    };
    console.log({ refreshToken });

    const { accessToken: access_token, ...user } = userProfile;

    const foundUser = await this.userService.findUserByTokenId(user.id_token);

    const createdUser = await this.userService.createUser(userProfile);

    const payloadToken: PayloadToken = {
      sub: foundUser ? foundUser.id_token : createdUser?.id_token,
      accessToken: access_token,
      sheetId: foundUser ? foundUser.sheetId : createdUser?.sheetId,
    };

    // const jwt: string = await this.authService.signJWT(payloadToken);

    // done(null, jwt);
  }
}
