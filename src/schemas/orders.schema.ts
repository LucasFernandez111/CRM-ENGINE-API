import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { OrderStatus } from '../modules/orders/dto/create-order.dto';
import { PaymentMethod, PaymentStatus } from '../modules/orders/dto/payment.dto';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: String })
  email: string;
  @Prop({ type: Number })
  orderNumber: number;

  @Prop({
    type: {
      name: { type: String },
      phone: { type: String },
      address: {
        street: { type: String },
        city: { type: String },
      },
    },
  })
  customer: {
    name: string;
    phone: string;
    address: {
      street: string;
      city: string;
    };
  };

  @Prop([
    {
      category: { type: String },
      subcategory: { type: String },
      quantity: { type: Number },
      price: { type: Number },
    },
  ])
  items: {
    category: string;
    subcategory: string;
    quantity: number;
    price: number;
  }[];

  @Prop({
    type: {
      method: { type: String, enum: PaymentMethod },
      transactionId: { type: String },
      status: {
        type: String,
        enum: PaymentStatus,
        default: 'PENDIENTE',
      },
    },
  })
  paymentDetails: {
    method: string;
    status: PaymentStatus;
  };

  @Prop({})
  totalAmount: number;

  @Prop({
    type: String,
    enum: OrderStatus,
    default: 'PENDIENTE',
  })
  orderStatus: OrderStatus;

  @Prop({ type: String })
  notes?: string;

  createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
