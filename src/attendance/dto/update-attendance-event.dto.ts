import { PartialType } from '@nestjs/mapped-types';
import { CreateAttendanceEventDto } from './create-attendance-event.dto';

export class UpdateAttendanceEventDto extends PartialType(
  CreateAttendanceEventDto,
) {}
