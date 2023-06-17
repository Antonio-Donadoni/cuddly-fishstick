import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { Appointment } from 'src/appointment/schemas/appointment.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  //   @Prop({ type: mongoose.Schema.Types.ObjectId })
  //   _id: string;

  @Prop()
  nome: string;

  @Prop()
  cognome: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  telefono: string;

  @Prop()
  ruolo: string;

  @Prop()
  sesso: string;

  @Prop()
  azienda: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' })
  appointments: Appointment[];
}

export const UserSchema = SchemaFactory.createForClass(User);
