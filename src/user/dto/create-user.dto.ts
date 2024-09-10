import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  position: string;

  @IsString()
  @IsNotEmpty()
  hireDate: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(Role, {
    message: 'Valid role required.',
  })
  role: Role;
  @IsString()
  @IsNotEmpty()
  departmentId: string;

  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[0-9])/, {
    message: 'Password must contain at least six characters',
  })
  password: string;
}
