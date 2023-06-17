import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentModule } from './appointment/appointment.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CustomConfigModule } from './config.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    AppointmentModule,
    UserModule,
    AuthModule,
    CustomConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
