import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

export type AppointmentDocument = HydratedDocument<Appointment>;

@Schema()
export class Appointment {
  //   @Prop({ type: mongoose.Schema.Types.ObjectId })
  //   _id: string;

  @Prop()
  titolo: string;

  @Prop()
  descrizione: string;

  @Prop()
  tipo: string;

  @Prop()
  data: string;

  @Prop()
  completato: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
