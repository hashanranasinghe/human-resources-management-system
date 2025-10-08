import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
  providers: [SharedService, DatabaseService],
  exports: [SharedService],
})
export class SharedModule {}
