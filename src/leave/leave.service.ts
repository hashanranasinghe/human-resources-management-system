import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { SharedService } from 'src/shared/shared.service';

@Injectable()
export class LeaveService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly sharedService: SharedService,
  ) {}
}
