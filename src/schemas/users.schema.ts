import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ trim: true, default: null })
  firstName: string;

  @Prop({ required: true, trim: true })
  email: string;

  @Prop({ trim: true, default: null })
  company: string;

  @Prop({ trim: true, default: null })
  phone: string;

  @Prop({ trim: true, default: null })
  sheetId: string;

  @Prop({ trim: true, default: null })
  address: string;
}

export const UserSchema = SchemaFactory.createForClass(User); //Creacion de objeto para ser manipulado
