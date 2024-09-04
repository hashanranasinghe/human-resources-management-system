import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'INTERN'], {
    message: 'valid role requiered.',
  })
  role: 'SUPERADMIN' | 'ADMIN' | 'SUPERVISOR' | 'INTERN';

  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[0-9])/, {
    message: 'Password must contains at least six characters',
  })
  password: string;
}
