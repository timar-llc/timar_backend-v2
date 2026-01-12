import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';
import { StorageModule } from 'src/config/s3/s3.module';
import { HeleketModule } from 'src/payments/heleket/heleket.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Project]), StorageModule, HeleketModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
