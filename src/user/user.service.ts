import { Injectable, HttpException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  create(createUserDto: CreateUserDto) {
    const user = new this.userModel(createUserDto);
    return user.save();
  }

  findAll() {
    return this.userModel.find().exec();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new HttpException('Utente non trovato', 404);
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new HttpException('Utente non trovato', 404);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel
      .findByIdAndUpdate(id, { $set: updateUserDto }, { new: true })
      .exec();

    if (!user) {
      throw new HttpException('Utente non trovato', 404);
    }

    return user;
  }

  async remove(id: string) {
    const user = await this.userModel.findByIdAndDelete(id).exec();

    if (!user) {
      throw new HttpException('Utente non trovato', 404);
    }

    // delete also all appointments of this user

    const appointments = this.userModel.deleteMany({ user: id }).exec();

    return user;
  }
}
