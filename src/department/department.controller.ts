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
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Roles } from 'src/decorators/role.decorator';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/autherization.guard';

const UUIDPipe = new ParseUUIDPipe({
  errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
});

@Controller('department')
@UseGuards(AuthenticationGuard, AuthorizationGuard)
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Roles(['SUPERADMIN'])
  @Post()
  create(@Body(ValidationPipe) createDepartmentDto: CreateDepartmentDto) {
    return this.departmentService.create(createDepartmentDto);
  }

  @Roles(['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'INTERN'])
  @Get()
  findAll() {
    return this.departmentService.findAll();
  }

  @Roles(['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'INTERN'])
  @Get(':id')
  findOne(@Param('id', UUIDPipe) id: string) {
    return this.departmentService.findOne(id);
  }

  @Roles(['SUPERADMIN', 'ADMIN'])
  @Patch(':id')
  update(
    @Param('id', UUIDPipe) id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentService.update(id, updateDepartmentDto);
  }

  @Roles(['SUPERADMIN'])
  @Delete(':id')
  remove(@Param('id', UUIDPipe) id: string) {
    return this.departmentService.remove(id);
  }
}
