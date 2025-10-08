import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DatabaseService } from 'src/database/database.service';
import { v4 as uuidv4 } from 'uuid';
import { SharedService } from 'src/shared/shared.service';

@Injectable()
export class DepartmentService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly sharedService: SharedService,
  ) {}
  private async checkDepartmentById(departmentId: string) {
    const department = await this.databaseService.department.findUnique({
      where: { refId: departmentId },
      include: {
        creator: true,
        manager: true,
      },
    });

    if (!department) {
      throw new NotFoundException(
        `Department with ID ${departmentId} not found.`,
      );
    }
    return department;
  }

  async create(createDepartmentDto: CreateDepartmentDto) {
    await this.sharedService.checkEmployeeById(createDepartmentDto.createrId);
    await this.sharedService.checkEmployeeById(createDepartmentDto.managerId);
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
    return this.checkDepartmentById(id);
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    await this.checkDepartmentById(id);
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

  async remove(id: string) {
    await this.checkDepartmentById(id);
    return this.databaseService.department.delete({
      where: { refId: id },
    });
  }
}
