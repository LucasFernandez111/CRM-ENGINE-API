import { HttpException, HttpStatus } from '@nestjs/common';

export class ErrorManager extends Error {
  constructor({ type, message }: { type: keyof typeof HttpStatus; message: string }) {
    super(`[${type}] :: ${message}`);
  }

  public static createSignatureError(message: string): HttpException {
    const [name] = message.split('::');
    const status = HttpStatus[name as keyof typeof HttpStatus];
    if (status) {
      return new HttpException(message, status);
    }
    return new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
