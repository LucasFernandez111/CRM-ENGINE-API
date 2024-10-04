import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class ItemDto {
  @IsNotEmpty()
  @IsString()
  readonly category: string;
  @IsNotEmpty()
  @IsString()
  readonly subcategory: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsNumber()
  readonly quantity: number;

  @IsNotEmpty()
  @IsNumber()
  readonly price: number;
}
