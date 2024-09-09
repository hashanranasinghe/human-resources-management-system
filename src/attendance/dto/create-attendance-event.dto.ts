import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { EventType } from '@prisma/client';

export class CreateAttendanceEventDto {
  @IsInt()
  @IsNotEmpty()
  attendanceId: number;

  @IsEnum(EventType)
  @IsNotEmpty()
  eventType: EventType;

  @IsNotEmpty()
  eventTime: string;
}
