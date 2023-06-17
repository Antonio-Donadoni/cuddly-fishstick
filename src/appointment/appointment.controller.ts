import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Request() req: any,
  ) {
    return this.appointmentService.create(createAppointmentDto, req);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.appointmentService.findAll(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentService.findOne(id);
  }

  @Get('/user/:id')
  getAppointmentsByUserId(@Param('id') id: string) {
    return this.appointmentService.getAppointmentsByUserId(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentService.update(id, updateAppointmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(id);
  }
}
