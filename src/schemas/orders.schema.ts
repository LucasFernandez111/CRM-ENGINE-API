import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true })
  orderNumber: number;

  @Prop({
    type: {
      id: { type: Types.ObjectId, ref: 'User', required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
      },
    },
    required: true,
  })
  customer: {
    id: Types.ObjectId;
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };

  @Prop([
    {
      productId: { type: Types.ObjectId, ref: 'Product', required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      total: { type: Number, required: true },
    },
  ])
  items: {
    productId: Types.ObjectId;
    name: string;
    quantity: number;
    price: number;
    total: number;
  }[];

  @Prop({
    type: {
      method: { type: String, required: true },
      transactionId: { type: String, required: true },
      status: { type: String, enum: ['Pending', 'Completed', 'Failed'], required: true },
    },
    required: true,
  })
  paymentDetails: {
    method: string;
    transactionId: string;
    status: 'Pending' | 'Completed' | 'Failed';
  };

  @Prop({ required: true })
  totalAmount: number;

  @Prop({
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  })
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

  @Prop({ type: String })
  notes?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
