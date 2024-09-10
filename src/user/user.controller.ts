import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/autherization.guard';
import { Roles } from 'src/decorators/role.decorator';

const UUIDPipe = new ParseUUIDPipe({
  errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
});
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create-user')
  createUser(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
  @Post('sign-in')
  signIn(@Body(ValidationPipe) loginUserDto: LoginAuthDto) {
    return this.userService.signIn(loginUserDto);
  }

  @Roles(['ADMIN', 'SUPERADMIN'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Roles(['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'INTERN'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get(':id')
  findOne(
    @Param('id', UUIDPipe)
    id: string,
  ) {
    return this.userService.findOne(id);
  }

  @Roles(['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'INTERN'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Patch(':id')
  update(
    @Param('id', UUIDPipe)
    id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Roles(['SUPERADMIN', 'ADMIN'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Delete(':id')
  remove(
    @Param('id', UUIDPipe)
    id: string,
  ) {
    return this.userService.remove(id);
  }
}
