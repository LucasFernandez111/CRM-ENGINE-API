import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ServiceAccountDTO } from './dto/service-account.dto';
import { UserService } from '../users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly JWTService: JwtService,
    private readonly userService: UserService,
  ) {}

  // // public signUp() {}
  // public validateUser(user: any) {
  //   return this.userService.findUserByEmail(user.email);
  // }

  /**
   * Genera un JWT para un service account
   * @param serviceAccount
   * @returns JWT
   */
  public signIn(serviceAccount: ServiceAccountDTO): string {
    return this.JWTService.sign(serviceAccount);
  }
}
