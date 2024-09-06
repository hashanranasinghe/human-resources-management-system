import { Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class DepartmentService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createDepartmentDto: CreateDepartmentDto) {
    return this.databaseService.department.create({
      data: {
        name: createDepartmentDto.name,
        creator: {
          connect: { id: createDepartmentDto.createrId },
        },
        manager: {
          connect: { id: createDepartmentDto.managerId },
        },
      },
    });
  }

  findAll() {
    return this.databaseService.department.findMany({
      include: {
        creator: true,
        manager: true,
      },
    });
  }

  async findOne(id: number) {
    const department = await this.databaseService.department.findUnique({
      where: { id },
      include: {
        creator: true,
        manager: true,
      },
    });
    if (!department) {
      throw new Error(`Department with ID ${id} not found`);
    }
    return department;
  }

  update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    return this.databaseService.department.update({
      where: { id },
      data: {
        name: updateDepartmentDto.name,
        creator: {
          connect: { id: updateDepartmentDto.createrId },
        },
        manager: {
          connect: { id: updateDepartmentDto.managerId },
        },
      },
    });
  }

  remove(id: number) {
    return this.databaseService.department.delete({
      where: { id },
    });
  }
}
