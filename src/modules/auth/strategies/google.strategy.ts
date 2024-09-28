import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UsersService } from 'src/modules/users/services/user.service';
import { AuthService } from '../services/auth.service';

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
      accessType: 'offline',

      scope: ['email', 'profile', 'https://www.googleapis.com/auth/spreadsheets'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<void> {
    const { name, emails, photos } = profile;

    const userProfile = {
      id_token: profile.id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos.length > 0 ? photos[0].value : null,
      refresh_token: refreshToken,
      accessToken,
    };
    const { accessToken: token, ...user } = userProfile;
    // const userFind = await this.userService.findUserByTokenId(token);
    // if (!userFind) await this.userService.createUser(user);

    const jwt = await this.authService.signJWT(user);

    done(null, jwt);
  }
}
