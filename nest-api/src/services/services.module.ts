import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { ServicesController } from './services.controller';
import { UsersService } from '../users/users.service';
import { Service } from './services.service';

@Module({
  imports: [DbModule],
  controllers: [ServicesController],
  providers: [UsersService, Service],
})
export class ServicesModule {}