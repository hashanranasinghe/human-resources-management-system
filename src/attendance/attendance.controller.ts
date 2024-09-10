import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/autherization.guard';
import { Roles } from 'src/decorators/role.decorator';
import { CreateAttendanceEventDto } from './dto/create-attendance-event.dto';

const UUIDPipe = new ParseUUIDPipe({
  errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
});
@Controller('attendance')
@UseGuards(AuthenticationGuard, AuthorizationGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Roles(['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'INTERN'])
  @Post()
  addAttendance(
    @Body(ValidationPipe) createAttendanceDto: CreateAttendanceDto,
  ) {
    return this.attendanceService.addAttendance(createAttendanceDto);
  }

  @Get()
  findAll() {
    return this.attendanceService.findAll();
  }

  @Roles(['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'INTERN'])
  @Get(':id')
  findOne(
    @Param('id', UUIDPipe)
    id: string,
  ) {
    return this.attendanceService.findOne(id);
  }

  @Roles(['SUPERADMIN', 'ADMIN', 'SUPERVISOR'])
  @Patch(':id')
  update(
    @Param('id', UUIDPipe)
    id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
    return this.attendanceService.update(id, updateAttendanceDto);
  }

  @Roles(['SUPERADMIN', 'ADMIN', 'SUPERVISOR'])
  @Delete(':id')
  remove(
    @Param('id', UUIDPipe)
    id: string,
  ) {
    return this.attendanceService.remove(id);
  }

  @Roles(['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'INTERN'])
  @Post('attendance-event')
  addAttendanceEvent(
    @Body(ValidationPipe) createAttendanceEventDto: CreateAttendanceEventDto,
  ) {
    return this.attendanceService.addAttendanceEvent(createAttendanceEventDto);
  }

  @Roles(['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'INTERN'])
  @Get('attendance-event/:id')
  findAttendanceEvents(
    @Param('id', UUIDPipe)
    id: string,
  ) {
    return this.attendanceService.findAttendanceEvents(id);
  }
}
