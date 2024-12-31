import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ServiceAccountDTO } from './dto/service-account.dto';
import { UserService } from '../users/user.service';
import { User } from 'src/schemas';

@Injectable()
export class AuthService {
  constructor(
    private readonly JWTService: JwtService,
    private readonly userService: UserService,
  ) {}

  public async existsUser(email: string): Promise<User> {
    return await this.userService.findUserByEmail(email);
  }
  /**
   * Genera un JWT para un service account
   * @param serviceAccount
   * @returns JWT
   */
  public async signIn(serviceAccount: ServiceAccountDTO): Promise<string> {
    const user = await this.existsUser(serviceAccount.client_email);
    if (!user) await this.userService.create({ email: serviceAccount.client_email });
    return this.JWTService.sign(serviceAccount);
  }
}
