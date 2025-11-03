import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ApiBearerAuth, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Project } from './entities/project.entity';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ProjectParamsDto } from './params/project.params.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { StatusOkDto } from 'src/common/dto/success.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('media', 10))
  async create(
    @Body() createProjectDto: CreateProjectDto,

    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: User,
  ): Promise<Project> {
    return this.projectsService.create(createProjectDto, files, user.uuid);
  }

  @Get(':uuid')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  async finaOne(@Param('uuid') uuid: string): Promise<Project> {
    return this.projectsService.findOne(uuid);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  async findAll(
    @Query() paginateParamsDto: ProjectParamsDto,
  ): Promise<Project[]> {
    return this.projectsService.findAll(paginateParamsDto);
  }

  @Patch(':uuid')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('media', 10))
  async updateProject(
    @Param('uuid') uuid: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: User,
  ): Promise<Project> {
    return this.projectsService.update(
      uuid,
      updateProjectDto,
      files,
      user.uuid,
    );
  }

  @Delete(':uuid')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  async deleteProject(@Param('uuid') uuid: string): Promise<StatusOkDto> {
    return this.projectsService.delete(uuid);
  }
}
