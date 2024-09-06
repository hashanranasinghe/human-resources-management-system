import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  createrId: number;

  @IsInt()
  @IsNotEmpty()
  managerId: number;
}
