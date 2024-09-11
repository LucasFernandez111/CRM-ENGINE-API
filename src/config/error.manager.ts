import { HttpException, HttpStatus } from '@nestjs/common';

export class ErrorManager extends Error {
  constructor({ type, message }: { type: keyof typeof HttpStatus; message: string }) {
    super(`${type} :: ${message}`);
  }

  /**
   * Crea una firma de excepción HTTP basada en el mensaje proporcionado.
   *
   * @param {string} message - El mensaje de error para el cual se crea una firma.
   * @throws {HttpException} Una excepción HTTP con un código de estado derivado del mensaje.
   */
  public static createSignatureError(message: string) {
    const name = message.split('::')[0];
    if (name) throw new HttpException(message, HttpStatus[name]);
  }
}
