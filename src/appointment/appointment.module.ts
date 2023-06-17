import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentSchema } from './schemas/appointment.schema';
import { UserSchema } from 'src/user/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Appointment', schema: AppointmentSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
