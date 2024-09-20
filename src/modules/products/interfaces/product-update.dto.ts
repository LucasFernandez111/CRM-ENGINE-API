import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { Product } from 'src/schemas/products.schema';

export class ProductUpdateDTO implements Omit<Product, 'userId'> {
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
