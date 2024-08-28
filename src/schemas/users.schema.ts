import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UsersDocument = HydratedDocument<Users>;

@Schema({
  timestamps: true,
})
export class Users {
  @Prop({
    unique: true,
    required: true,
    trim: true,
  })
  id_token: string;

  @Prop({ trim: true })
  picture: string;

  @Prop({ trim: true })
  firstName: string;

  @Prop({ trim: true })
  email: string;

  @Prop({ trim: true })
  sheet?: string;

  @Prop({ trim: true })
  company?: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ trim: true })
  address?: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users); //Creacion de objeto para ser manipulado
