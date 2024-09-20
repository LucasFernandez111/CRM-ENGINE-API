import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Product } from 'src/schemas/products.schema';

export class ProductCreateDTO implements Product {
  @IsOptional()
  @IsString()
  userId: string;
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  category: string;
  @IsNotEmpty()
  @IsString()
  subcategory: string;
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsNotEmpty()
  @IsNumber()
  price: number;
  @IsNotEmpty()
  @IsNumber()
  stock: number;
}
