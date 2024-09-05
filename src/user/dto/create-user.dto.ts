import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsInt,
  IsDate,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  position: string;

  @IsDate()
  @IsNotEmpty()
  hireDate: Date;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'INTERN'], {
    message: 'Valid role required.',
  })
  role: 'SUPERADMIN' | 'ADMIN' | 'SUPERVISOR' | 'INTERN';
  @IsInt()
  @IsNotEmpty()
  departmentId: number;

  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[0-9])/, {
    message: 'Password must contain at least six characters',
  })
  password: string;
}
