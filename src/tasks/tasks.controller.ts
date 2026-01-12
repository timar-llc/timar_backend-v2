import {
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Body } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { TaskParamsDto } from './params/task.params.dto';
import { Task, TaskWithPagination } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { StatusOkDto } from 'src/common/dto/success.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 10))
  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: User,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Task> {
    return await this.tasksService.create(createTaskDto, files, user.uuid);
  }
  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  async findAll(
    @Query() taskParamsDto: TaskParamsDto,
    @CurrentUser() user: User,
  ): Promise<TaskWithPagination> {
    return await this.tasksService.findAll(taskParamsDto, user.uuid);
  }
  @Get(':uuid')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  async findOne(
    @Param('uuid') uuid: string,
    @Query('lang') lang: string,
    @CurrentUser() user: User,
  ): Promise<Task> {
    return await this.tasksService.findOne(uuid, lang, user.uuid);
  }
  @Patch(':uuid')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 10))
  async update(
    @Param('uuid') uuid: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Task> {
    return await this.tasksService.update(uuid, updateTaskDto, files);
  }


  @Delete(':uuid')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  async remove(@Param('uuid') uuid: string): Promise<StatusOkDto> {
    return await this.tasksService.remove(uuid);
  }
}
