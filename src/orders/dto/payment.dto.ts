import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export enum PaymentStatus {
  PENDIENTE = 'Pendiente',
  COMPLETADO = 'Completado',
  FALLIDO = 'Fallido',
}

export enum PaymentMethod {
  TRANSFERENCIA = 'Transferencia',
  EFECTIVO = 'Efectivo',
}
export class PaymentDetailsDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(PaymentMethod)
  readonly method: PaymentMethod;

  @IsOptional()
  @IsString()
  readonly transactionId: string;

  @IsOptional()
  @IsEnum(PaymentStatus)
  readonly status: PaymentStatus;
}
