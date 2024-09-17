import { IsNotEmpty, IsOptional, IsString, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentDetailsDto } from './payment.dto';
import { CustomerDto } from './customer.dto';
import { ItemDto } from './item.dto';

export enum OrderStatus {
  PENDIENTE = 'PENDIENTE',
  PROCESANDO = 'PROCESANDO',
  ENVIADO = 'ENVIADO',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO',
}

export class CreateOrderDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CustomerDto)
  readonly customer: CustomerDto;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  readonly items: ItemDto[];

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PaymentDetailsDto)
  readonly paymentDetails: PaymentDetailsDto;

  @IsOptional()
  @IsEnum(OrderStatus)
  readonly status?: OrderStatus;

  @IsOptional()
  @IsString()
  readonly notes?: string;
}
