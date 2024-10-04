import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import ErrorManager from 'src/config/error.manager';
import { UsersService } from '../services/user.service';
import { User } from 'src/schemas';

@Injectable()
export class UserExistsGuard implements CanActivate {
  constructor(private readonly userService: UsersService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const id_token: string = req?.user?.sub;

    if (!id_token)
      throw ErrorManager.createSignatureError(
        new ErrorManager({ type: 'UNAUTHORIZED', message: 'Token not found' }).message,
      );

    const user: User = await this.userService.findUserByTokenId(id_token);

    if (!user)
      throw ErrorManager.createSignatureError(
        new ErrorManager({ type: 'UNAUTHORIZED', message: 'User not found' }).message,
      );
    return true;
  }
}
