import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAttendanceDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsString()
  @IsNotEmpty()
  timeIn: string;

  @IsString()
  @IsNotEmpty()
  timeOut: string;
}
