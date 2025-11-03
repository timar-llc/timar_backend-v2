import { Module } from '@nestjs/common';
import { RespondesService } from './respondes.service';
import { RespondesController } from './respondes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Respond } from './entities/respond.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Respond, Task, User])],
  controllers: [RespondesController],
  providers: [RespondesService],
  exports: [RespondesService],
})
export class RespondesModule {}
