import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export enum PaymentStatus {
  PENDIENTE = 'PENDIENTE',
  COMPLETADO = 'COMPLETADO',
  FALLIDO = 'FALLIDO',
}

export enum PaymentMethod {
  TRANSFERENCIA = 'TRANSFERENCIA',
  EFECTIVO = 'EFECTIVO',
}
export class PaymentDetailsDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(PaymentMethod)
  readonly method: PaymentMethod;

  @IsOptional()
  @IsString()
  @IsEnum(PaymentStatus)
  readonly status?: PaymentStatus;
}
