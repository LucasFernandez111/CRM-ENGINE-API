import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentDetailsDto } from './payment.dto';
import { CustomerDto } from './customer.dto';
import { ItemDto } from './item.dto';

export enum OrderStatus {
  PENDIENTE = 'Pendiente',
  PROCESANDO = 'Procesando',
  ENVIADO = 'Enviado',
  ENTREGADO = 'Entregado',
  CANCELADO = 'Cancelado',
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  readonly orderNumber: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CustomerDto)
  readonly customer: CustomerDto;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  readonly items: ItemDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PaymentDetailsDto)
  readonly paymentDetails: PaymentDetailsDto;

  @IsNotEmpty()
  @IsNumber()
  readonly totalAmount: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  readonly status?: OrderStatus;

  @IsOptional()
  @IsString()
  readonly notes?: string;
}
