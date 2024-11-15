import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import ErrorManager from 'src/config/error.manager';
import { PayloadToken } from 'src/modules/auth/interfaces/payload-token.interface';
import { UsersService } from 'src/modules/users/services/user.service';
import { User } from 'src/schemas';

@Injectable()
export class SheetGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const requestUser: PayloadToken = request?.user;
    const idTokenUser = requestUser?.sub;

    if (requestUser.hasOwnProperty('sheetId') && requestUser.sheetId) return true;

    const user: User = await this.usersService.findUserByTokenId(idTokenUser);
    if (!user) {
      throw ErrorManager.createSignatureError(
        new ErrorManager({ type: 'UNAUTHORIZED', message: 'User not found' }).message,
      );
    }
    requestUser.sheetId = user.sheetId;

    return true;
  }
}
