import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type OrdersDocument = HydratedDocument<Orders>;
@Schema({
  timestamps: true,
})
export class Orders extends Document {
  @Prop({
    unique: true,
    required: true,
  })
  idToken: string;

  @Prop({ required: true })
  order: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  food: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  price: number;
}

const OrdersSchema = SchemaFactory.createForClass(Orders);
export { OrdersSchema };
