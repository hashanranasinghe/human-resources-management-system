import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EventType } from '@prisma/client';

export class CreateAttendanceEventDto {
  @IsString()
  @IsNotEmpty()
  attendanceId: string;

  @IsEnum(EventType)
  @IsNotEmpty()
  eventType: EventType;

  @IsNotEmpty()
  eventTime: string;
}
