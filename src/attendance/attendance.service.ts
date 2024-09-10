import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { DatabaseService } from 'src/database/database.service';
import { CreateAttendanceEventDto } from './dto/create-attendance-event.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AttendanceService {
  constructor(private readonly databaseService: DatabaseService) {}

  private async checkEmployeeById(employeeId: string) {
    const employee = await this.databaseService.employee.findUnique({
      where: { refId: employeeId },
    });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found.`);
    }
    return employee;
  }

  private async checkAttendanceById(attendanceId: string) {
    const attendance = await this.databaseService.attendance.findUnique({
      where: { refId: attendanceId },
    });
    if (!attendance) {
      throw new NotFoundException(
        `Attendance with ID ${attendanceId} not found.`,
      );
    }
    return attendance;
  }

  async addAttendance(createAttendanceDto: CreateAttendanceDto) {
    await this.checkEmployeeById(createAttendanceDto.employeeId);

    const uid = uuidv4();
    return this.databaseService.attendance.create({
      data: { ...createAttendanceDto, refId: uid },
    });
  }

  findAll() {
    return this.databaseService.attendance.findMany();
  }

  async findOne(id: string) {
    await this.checkEmployeeById(id);

    const attendance = await this.databaseService.attendance.findMany({
      where: { employeeId: id },
      include: { employee: true },
    });
    if (attendance.length === 0) {
      throw new NotFoundException(
        `No attendance records found for employee with ID ${id}.`,
      );
    }
    return attendance;
  }

  async update(id: string, updateAttendanceDto: UpdateAttendanceDto) {
    await this.checkAttendanceById(id);

    return this.databaseService.attendance.update({
      where: { refId: id },
      data: updateAttendanceDto,
    });
  }

  async remove(id: string) {
    await this.checkAttendanceById(id);

    return this.databaseService.attendance.delete({
      where: { refId: id },
    });
  }

  async addAttendanceEvent(createAttendanceEventDto: CreateAttendanceEventDto) {
    await this.checkAttendanceById(createAttendanceEventDto.attendanceId);

    const uid = uuidv4();
    return this.databaseService.attendanceEvent.create({
      data: { ...createAttendanceEventDto, refId: uid },
    });
  }

  async findAttendanceEvents(id: string) {
    await this.checkAttendanceById(id);

    const attendanceEvents =
      await this.databaseService.attendanceEvent.findMany({
        where: { attendanceId: id },
      });
    if (attendanceEvents.length === 0) {
      throw new NotFoundException(
        `No events found for attendance with ID ${id}.`,
      );
    }
    return attendanceEvents;
  }
}
