import { forwardRef, Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import { TaskFile } from './entities/taskFile.entity';
import { StorageModule } from 'src/config/s3/s3.module';
import { AppModule } from 'src/app.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User, TaskFile]),
    StorageModule,
    forwardRef(() => AppModule),
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
