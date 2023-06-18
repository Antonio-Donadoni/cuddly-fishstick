import { HttpException, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Appointment } from './schemas/appointment.schema';
import { Model, Types } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  async create(createAppointmentDto: CreateAppointmentDto, req: any) {
    // get userID from request token

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new HttpException('Token mancante', 401);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new HttpException('Token mancante', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      throw new HttpException('Token non valido', 401);
    }

    const userId = decoded['id'];

    const { ...appointmentData } = createAppointmentDto;

    if (!Types.ObjectId.isValid(userId)) {
      throw new HttpException('ID utente non valido', 400);
    }

    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new HttpException('Utente non trovato', 404);
    }

    const appointment = new this.appointmentModel({
      ...appointmentData,
      user: user._id,
    });

    return appointment.save();
  }

  findAll(req: any): Promise<Appointment[]> {
    // get userID from request token

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new HttpException('Token mancante', 401);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new HttpException('Token mancante', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      throw new HttpException('Token non valido', 401);
    }

    const userId = decoded['id'];
    const ruolo = decoded['ruolo'];

    if (ruolo === 'admin') {
      console.log('ADMIN');
      // return appointments for all users left join user
      return this.appointmentModel
        .find()
        .populate('user', 'email nome cognome')
        .exec();
    } else {
      return this.appointmentModel.find({ user: userId }).exec();
    }
  }

  async getAppointmentsByUserId(userId: string): Promise<Appointment[]> {
    if (!Types.ObjectId.isValid(userId)) {
      // Gestisci il caso in cui l'ID non sia valido
      throw new HttpException('ID utente non valido', 400);
    }
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      // Gestisci il caso in cui l'utente non esista
      throw new HttpException('Utente non trovato', 404);
    }

    const appointments = await this.appointmentModel
      .find({ user: user._id })
      .exec();

    return appointments;
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentModel.findById(id).exec();

    if (!appointment || !appointment._id) {
      throw new HttpException('Appuntamento non trovato', 404);
    }

    return appointment;
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    const appointment = await this.appointmentModel.findByIdAndUpdate(
      id,
      updateAppointmentDto,
      { new: true },
    );

    if (!appointment) {
      throw new HttpException('Appuntamento non trovato', 404);
    }

    // get appointment with updated data and populate user

    const appointmentWithUser = await this.appointmentModel
      .findById(appointment._id)
      .populate('user', 'email nome cognome')
      .exec();

    return appointmentWithUser;
  }

  async remove(id: string) {
    const appointment = await this.appointmentModel
      .findByIdAndDelete(id)
      .exec();

    if (!appointment) {
      throw new HttpException('Appuntamento non trovato', 404);
    }

    return appointment;
  }
}
