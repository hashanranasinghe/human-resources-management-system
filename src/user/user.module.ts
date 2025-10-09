import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/database/database.module';
import { SharedModule } from 'src/shared/shared.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [DatabaseModule, SharedModule, EmailModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
