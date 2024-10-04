import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { OrderStatus } from '../modules/orders/dto/create-order.dto';
import { PaymentMethod, PaymentStatus } from '../modules/orders/dto/payment.dto';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: String, required: true })
  userId: string;
  @Prop({ required: true })
  orderNumber: number;

  @Prop({
    type: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, default: '0000', required: true },
        country: { type: String, required: true },
      },
    },
    required: true,
  })
  customer: {
    name: string;
    phone: string;
    address: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
    };
  };

  @Prop([
    {
      category: { type: String, required: true },
      subcategory: { type: String, required: true },
      description: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ])
  items: {
    category: string;
    subcategory: string;
    description: string;
    quantity: number;
    price: number;
  }[];

  @Prop({
    type: {
      method: { type: String, enum: PaymentMethod, default: 'EFECTIVO', required: true },
      transactionId: { type: String, default: '#', required: true },
      status: {
        type: String,
        enum: PaymentStatus,
        default: 'PENDIENTE',
        required: true,
      },
    },
    required: true,
  })
  paymentDetails: {
    method: string;
    status: PaymentStatus;
  };

  @Prop({ required: true })
  totalAmount: number;

  @Prop({
    type: String,
    enum: OrderStatus,
    default: 'PENDIENTE',
  })
  orderStatus: OrderStatus;

  @Prop({ type: String })
  notes?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
