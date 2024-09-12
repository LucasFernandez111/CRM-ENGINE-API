import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
export enum PaymentStatus {
  PENDIENTE = 'Pendiente',
  COMPLETADO = 'Completado',
  FALLIDO = 'Fallido',
}

export enum PaymentMethod {
  TRANSFERENCIA = 'TRANSFERENCIA',
  EFECTIVO = 'EFECTIVO',
}
export class PaymentDetailsDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(PaymentMethod)
  @Type(() => String)
  readonly method: PaymentMethod;

  @IsOptional()
  @IsString()
  readonly transactionId?: string;

  @IsOptional()
  @IsEnum(PaymentStatus)
  readonly status?: PaymentStatus;
}
