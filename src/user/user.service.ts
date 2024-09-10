import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  private async checkEmployeeByEmail(email: string) {
    const employee = await this.databaseService.employee.findUnique({
      where: { email },
    });
    if (employee) throw new BadRequestException('Email is already used');
  }

  private async checkEmployeeById(id: string) {
    const employee = await this.databaseService.employee.findUnique({
      where: { refId: id },
    });
    if (!employee)
      throw new NotFoundException(`Employee with ID ${id} not found`);
    return employee;
  }

  async createUser(createUserDto: CreateUserDto) {
    await this.checkEmployeeByEmail(createUserDto.email);

    const hashPassword = await bcrypt.hash(createUserDto.password, 10);
    const uid = uuidv4();

    return this.databaseService.employee.create({
      data: {
        ...createUserDto,
        refId: uid,
        password: hashPassword,
      },
    });
  }

  async signIn(credentials: LoginAuthDto) {
    const { email, password } = credentials;
    const user = await this.databaseService.employee.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.generateUserToken(user.id, user.role);
    return { ...accessToken, user: user.id };
  }

  generateUserToken(userId: number, userRole: string) {
    const accessToken = this.jwtService.sign(
      { userId, userRole },
      { expiresIn: '1h' },
    );
    return { accessToken };
  }

  findAll() {
    return this.databaseService.employee.findMany();
  }

  async findOne(id: string) {
    return this.checkEmployeeById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.checkEmployeeById(id);

    return this.databaseService.employee.update({
      where: { refId: id },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    await this.checkEmployeeById(id);

    return this.databaseService.employee.delete({
      where: { refId: id },
    });
  }
}
