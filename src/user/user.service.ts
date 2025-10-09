import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from 'src/database/database.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UserService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
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

    const employee = await this.databaseService.employee.create({
      data: { ...createUserDto, refId: uid, password: hashPassword },
    });

    // Send welcome email
    try {
      await this.emailService.sendWelcomeEmail(createUserDto.email, {
        employeeName: createUserDto.name,
        position: createUserDto.positionId,
        loginUrl: `${process.env.FRONTEND_URL}/login`,
      });
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
    return employee;
  }

  async signIn(credentials: LoginAuthDto) {
    const { email, password } = credentials;
    const user = await this.databaseService.employee.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate both access and refresh tokens
    const tokens = await this.generateUserTokens(user.refId, user.role);

    // Store refresh token hash in database
    const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10);
    await this.databaseService.employee.update({
      where: { refId: user.refId },
      data: { refreshToken: refreshTokenHash },
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: { id: user.refId, email: user.email, role: user.role },
    };
  }

  async generateUserTokens(userId: string, userRole: string) {
    const accessToken = this.jwtService.sign(
      { userId, userRole },
      { expiresIn: '15m' },
    );

    const refreshToken = this.jwtService.sign({ userId }, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);

      const user = await this.databaseService.employee.findUnique({
        where: { refId: payload.userId },
      });

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isRefreshTokenValid = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );
      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateUserTokens(user.refId, user.role);

      const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10);
      await this.databaseService.employee.update({
        where: { refId: user.refId },
        data: { refreshToken: refreshTokenHash },
      });

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    // Clear refresh token from database
    await this.databaseService.employee.update({
      where: { refId: userId },
      data: { refreshToken: null },
    });
    return { message: 'Logged out successfully' };
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

    return this.databaseService.employee.delete({ where: { refId: id } });
  }
}
