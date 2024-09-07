import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateAttendanceDto {
  @IsInt()
  @IsNotEmpty()
  employeeId: number;

  @IsString()
  @IsNotEmpty()
  timeIn: string;

  @IsString()
  @IsNotEmpty()
  timeOut: string;
}
