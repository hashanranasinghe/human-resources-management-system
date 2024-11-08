import { Module } from '@nestjs/common';
import { LeaveController } from './leave.controller';
import { LeaveService } from './leave.service';
import { DatabaseModule } from 'src/database/database.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [DatabaseModule, SharedModule],
  controllers: [LeaveController],
  providers: [LeaveService],
})
export class LeaveModule {}
