import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
/**
 * Schema for products
 */

@Schema({ timestamps: true, versionKey: false })
export class Product {
  @Prop({ type: String, required: true })
  userId: string;
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ type: String, required: true })
  subcategory: string;
  @Prop({ type: String, required: true })
  category: string;
  @Prop({ type: String, required: true })
  description: string;
  @Prop({ type: Number, required: true })
  price: number;
  @Prop({ type: Number, required: true })
  stock: number;
}

export const ProductsSchema = SchemaFactory.createForClass(Product);
