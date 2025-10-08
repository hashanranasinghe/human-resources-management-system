import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { DatabaseService } from 'src/database/database.service';
import { CreateAttendanceEventDto } from './dto/create-attendance-event.dto';
import { v4 as uuidv4 } from 'uuid';
import { SharedService } from 'src/shared/shared.service';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly sharedService: SharedService,
  ) {}

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
    await this.sharedService.checkEmployeeById(createAttendanceDto.employeeId);

    const uid = uuidv4();
    return this.databaseService.attendance.create({
      data: { ...createAttendanceDto, refId: uid },
    });
  }

  findAll() {
    return this.databaseService.attendance.findMany();
  }

  async findOne(id: string) {
    await this.sharedService.checkEmployeeById(id);

    const attendanceRecords = await this.databaseService.attendance.findMany({
      where: { employeeId: id },
      include: { employee: true },
    });

    if (attendanceRecords.length === 0) {
      throw new NotFoundException(
        `No attendance records found for employee with ID ${id}.`,
      );
    }

    const attendanceWithDuration = attendanceRecords.map((record) => {
      const timeIn = new Date(record.timeIn);
      const timeOut = new Date(record.timeOut);

      const durationMs = timeOut.getTime() - timeIn.getTime();
      const durationHours = durationMs / (1000 * 60 * 60);

      return {
        ...record,
        durationHours: durationHours.toFixed(2),
      };
    });

    return attendanceWithDuration;
  }
  async calculateTotalHours(id: string) {
    await this.sharedService.checkEmployeeById(id);

    const attendanceRecords = await this.databaseService.attendance.findMany({
      where: { employeeId: id },
    });

    if (attendanceRecords.length === 0) {
      throw new NotFoundException(
        `No attendance records found for employee with ID ${id}.`,
      );
    }

    const totalHours = attendanceRecords.reduce((sum, record) => {
      const timeIn = new Date(record.timeIn);
      const timeOut = new Date(record.timeOut);

      const durationHours =
        (timeOut.getTime() - timeIn.getTime()) / (1000 * 60 * 60);
      return sum + durationHours;
    }, 0);

    return {
      employeeId: id,
      totalHours: parseFloat(totalHours.toFixed(2)),
    };
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
    const currentTime = new Date();
    return this.databaseService.attendanceEvent.create({
      data: {
        ...createAttendanceEventDto,
        eventTime: currentTime.toISOString(),
        refId: uid,
      },
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
