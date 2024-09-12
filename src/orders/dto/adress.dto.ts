import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class AddressDto {
  @IsNotEmpty()
  @IsString()
  readonly street: string;

  @IsNotEmpty()
  @IsString()
  readonly city: string;

  @IsOptional()
  @IsString()
  readonly postalCode?: string;

  @IsNotEmpty()
  @IsString()
  readonly country: string;
}
