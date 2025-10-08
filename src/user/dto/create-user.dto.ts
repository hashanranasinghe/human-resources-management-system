import { Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  positionId: string;

  @IsString()
  @IsNotEmpty()
  hireDate: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(Role, { message: 'Valid role required.' })
  role: Role;

  @IsString()
  @IsOptional()
  departmentId: string;

  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[0-9])/, {
    message: 'Password must contain at least six characters and one number',
  })
  password: string;
}
