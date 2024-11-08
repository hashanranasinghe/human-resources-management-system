import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class SharedService {
  constructor(private readonly databaseService: DatabaseService) {}

  async checkEmployeeById(employeeId: string) {
    const employee = await this.databaseService.employee.findUnique({
      where: { refId: employeeId },
    });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found.`);
    }
    return employee;
  }
}
