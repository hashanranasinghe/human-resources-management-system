import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttendanceModule } from './attendance/attendance.module';
import config from './config/config';
import { DatabaseModule } from './database/database.module';
import { DatabaseService } from './database/database.service';
import { DepartmentModule } from './department/department.module';
import { LeaveModule } from './leave/leave.module';
import { PositionModule } from './position/position.module';
import { SharedModule } from './shared/shared.module';
import { SharedService } from './shared/shared.service';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
@Module({
  imports: [
    UserModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config) => ({
        secret: config.get('jwt.secret'),
      }),
      global: true,
      inject: [ConfigService],
    }),
    DepartmentModule,
    AttendanceModule,
    LeaveModule,
    SharedModule,
    PositionModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseService, SharedService],
})
export class AppModule {}
