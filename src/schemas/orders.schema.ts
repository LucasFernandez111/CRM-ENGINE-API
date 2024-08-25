import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type OrdersDocument = HydratedDocument<Orders>;
@Schema({
  timestamps: true,
  versionKey: false,
})
export class Orders extends Document {
  @Prop({
    required: true,
    trim: true,
  })
  id_token: string;

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

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;
}

const OrdersSchema = SchemaFactory.createForClass(Orders);
export { OrdersSchema };
