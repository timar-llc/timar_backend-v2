import { forwardRef, Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectMedia } from './entities/projectMedia.entity';
import { Category } from '../common/entities/category.entity';
import { StorageModule } from 'src/config/s3/s3.module';
import { User } from 'src/users/entities/user.entity';
import { AppModule } from 'src/app.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, ProjectMedia, Category, User]),
    StorageModule,
    forwardRef(() => AppModule),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
