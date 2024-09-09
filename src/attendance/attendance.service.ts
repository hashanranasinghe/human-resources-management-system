import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { DatabaseService } from 'src/database/database.service';
import { CreateAttendanceEventDto } from './dto/create-attendance-event.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AttendanceService {
  constructor(private readonly databaseService: DatabaseService) {}

  async addAttendance(createAttendanceDto: CreateAttendanceDto) {
    const employee = await this.databaseService.employee.findUnique({
      where: { refId: createAttendanceDto.employeeId },
    });

    if (!employee) {
      throw new NotFoundException(
        `Employee with ID ${createAttendanceDto.employeeId} not found.`,
      );
    }
    const uid = uuidv4();

    return this.databaseService.attendance.create({
      data: { ...createAttendanceDto, refId: uid },
    });
  }

  findAll() {
    return `This action returns all attendance`;
  }

  async findOne(id: string) {
    const employee = await this.databaseService.employee.findUnique({
      where: { refId: id },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found.`);
    }

    const attendance = await this.databaseService.attendance.findMany({
      where: { employeeId: id },
      include: {
        employee: true,
      },
    });
    if (attendance.length === 0) {
      throw new Error(`Empty attendance.`);
    }
    return attendance;
  }

  async update(id: string, updateAttendanceDto: UpdateAttendanceDto) {
    const attendance = await this.databaseService.attendance.findUnique({
      where: { refId: id },
    });

    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found.`);
    }
    return this.databaseService.attendance.update({
      where: { refId: id },
      data: updateAttendanceDto,
    });
  }

  async remove(id: string) {
    const attendance = await this.databaseService.attendance.findUnique({
      where: { refId: id },
    });

    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found.`);
    }

    return this.databaseService.attendance.delete({
      where: { refId: id },
    });
  }

  async addAttendanceEvent(createAttendanceEventDto: CreateAttendanceEventDto) {
    const attendance = await this.databaseService.attendance.findUnique({
      where: { refId: createAttendanceEventDto.attendanceId },
    });

    if (!attendance) {
      throw new NotFoundException(
        `Attendance with ID ${createAttendanceEventDto.attendanceId} not found.`,
      );
    }
    const uid = uuidv4();

    return this.databaseService.attendanceEvent.create({
      data: { ...createAttendanceEventDto, refId: uid },
    });
  }

  async findAttendanceEvents(id: string) {
    const attendance = await this.databaseService.attendance.findUnique({
      where: { refId: id },
    });

    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found.`);
    }

    const attendanceEvent = await this.databaseService.attendanceEvent.findMany(
      {
        where: { attendanceId: id },
      },
    );
    if (attendanceEvent.length === 0) {
      throw new Error(`Empty attendance events.`);
    }
    return attendanceEvent;
  }
}
