import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsEnum,
  IsArray,
  IsObject,
  ArrayMinSize,
} from 'class-validator';
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
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  readonly items: ItemDto[];

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => PaymentDetailsDto)
  readonly paymentDetails: PaymentDetailsDto;

  @IsNotEmpty()
  @IsString()
  @IsEnum(OrderStatus)
  readonly orderStatus?: OrderStatus;

  @IsOptional()
  @IsString()
  readonly notes?: string;
}
