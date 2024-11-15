import { IsNotEmpty, IsString } from 'class-validator';
export class AddressDto {
  @IsNotEmpty()
  @IsString()
  readonly street: string;

  @IsNotEmpty()
  @IsString()
  readonly city: string;
}
