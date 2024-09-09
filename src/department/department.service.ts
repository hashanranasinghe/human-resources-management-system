import { Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DatabaseService } from 'src/database/database.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DepartmentService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createDepartmentDto: CreateDepartmentDto) {
    const uid = uuidv4();

    return this.databaseService.department.create({
      data: {
        name: createDepartmentDto.name,
        refId: uid,
        creator: {
          connect: { refId: createDepartmentDto.createrId },
        },
        manager: {
          connect: { refId: createDepartmentDto.managerId },
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

  async findOne(id: string) {
    const department = await this.databaseService.department.findUnique({
      where: { refId: id },
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

  update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    return this.databaseService.department.update({
      where: { refId: id },
      data: {
        name: updateDepartmentDto.name,
        creator: {
          connect: { refId: updateDepartmentDto.createrId },
        },
        manager: {
          connect: { refId: updateDepartmentDto.managerId },
        },
      },
    });
  }

  remove(id: string) {
    return this.databaseService.department.delete({
      where: { refId: id },
    });
  }
}
