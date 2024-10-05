import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
export class ItemDto {
  @IsNotEmpty()
  @IsString()
  readonly category: string;

  @IsNotEmpty()
  @IsString()
  readonly subcategory: string;

  @IsNotEmpty()
  @IsNumber()
  readonly quantity: number;

  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly description?: string;
}
