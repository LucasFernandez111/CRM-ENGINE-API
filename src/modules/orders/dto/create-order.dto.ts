import { IsNotEmpty, IsOptional, IsString, ValidateNested, IsEnum, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentDetailsDto } from './payment.dto';
import { CustomerDto } from './customer.dto';
import { ItemDto } from './item.dto';

export enum OrderStatus {
  PENDIENTE = 'PENDIENTE',
  PROCESANDO = 'PROCESANDO',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO',
}

export class CreateOrderDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CustomerDto)
  readonly customer: CustomerDto;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PaymentDetailsDto)
  readonly paymentDetails: PaymentDetailsDto;

  @IsOptional()
  @IsEnum(OrderStatus)
  readonly orderStatus?: OrderStatus;

  @IsOptional()
  @IsString()
  readonly notes?: string;
}
