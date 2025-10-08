import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAttendanceDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  date: string;

  @IsString()
  @IsOptional()
  timeIn?: string;

  @IsOptional()
  @IsString()
  timeOut?: string;
}
