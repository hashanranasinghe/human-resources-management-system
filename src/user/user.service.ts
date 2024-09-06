import {
  BadRequestException,
  Injectable,
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
    private jwtService: JwtService,
  ) {}

  async createUser(createEmployeeDto: CreateUserDto) {
    const emailInUse = await this.databaseService.employee.findUnique({
      where: {
        email: createEmployeeDto.email,
      },
    });
    if (emailInUse) {
      throw new BadRequestException('email is already used');
    }
    const hashPassword = await bcrypt.hash(createEmployeeDto.password, 10);
    const uid = uuidv4();
    return this.databaseService.employee.create({
      data: {
        ...createEmployeeDto,
        uid: uid,
        password: hashPassword,
      },
    });
  }

  async signIn(credentials: LoginAuthDto) {
    const { email, password } = credentials;
    const user = await this.databaseService.employee.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new UnauthorizedException('wrong credentials');
    }
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      throw new UnauthorizedException('Wrong credentials');
    }
    const accessToken = await this.generateUserToken(user.id, user.role);

    return { ...accessToken, user: user.id };
  }

  async generateUserToken(userId: number, userRole: string) {
    const accessToken = this.jwtService.sign(
      { userId, userRole },
      { expiresIn: '1h' },
    );
    return { accessToken };
  }

  findAll() {
    return this.databaseService.employee.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
