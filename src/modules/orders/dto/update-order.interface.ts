import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CustomerDto } from './customer.dto';
import { ItemDto } from './item.dto';
import { PaymentDetailsDto } from './payment.dto';
import { OrderStatus } from './create-order.dto';
export class UpdateOrderDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => CustomerDto)
  readonly customer: CustomerDto;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  readonly items: ItemDto[];

  @IsOptional()
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
