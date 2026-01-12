import { Injectable } from '@nestjs/common';
import { Task, TaskWithPagination } from './entities/task.entity';
import {
  FindOptionsWhere,
  FindOptionsOrder,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskFile } from './entities/taskFile.entity';
import { TaskParamsDto } from './params/task.params.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { StatusOkDto } from 'src/common/dto/success.dto';
import { StorageService } from 'src/config/s3/s3.service';
import { DbDto } from 'src/common/dto/db.dto';
import { AppService } from 'src/app.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(TaskFile)
    private taskFileRepository: Repository<TaskFile>,
    private storageService: StorageService,
    private appService: AppService,
  ) {}

  async create(
    createTaskDto: CreateTaskDto,
    files: Express.Multer.File[],
    userUuid: string,
  ): Promise<Task> {
    console.log(createTaskDto);
    let task = this.taskRepository.create({
      ...createTaskDto,
      complexity: 'medium',
      user: { uuid: userUuid },
      category: { uuid: createTaskDto.categoryUuid },
    });
    task = await this.taskRepository.save(task);
    if (files) {
      for (const file of files) {
        console.log(file);
        const uploaded = await this.storageService.uploadFile(file);
        console.log(uploaded.url);
        const taskFile = this.taskFileRepository.create({
          url: uploaded.url,
          name: uploaded.name,
          type: 'file',
          task,
        });
        await this.taskFileRepository.save(taskFile);
      }
    }
    return await this.taskRepository.findOneOrFail({
      where: { uuid: task.uuid },
      relations: ['files', 'category'],
    });
  }

  async findAll(
    taskParamsDto: TaskParamsDto,
    userUuid: string,
  ): Promise<TaskWithPagination> {
    const {
      lang,

      skip,
      take,
      search,
      categoryUuid,
      categorySlugs,
      orderBy,
      minPrice,
      maxPrice,
      complexity,
      complexities,
      isDraft,
      my,
    } = taskParamsDto;

    console.log(isDraft);
    const qb = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.files', 'files')
      .leftJoinAndSelect('task.category', 'category')
      .leftJoinAndSelect('task.user', 'user');

    if (my === true) {
      qb.where('task.user_uuid = :userUuid', { userUuid });
    }

    if (search) {
      qb.andWhere('task.title ILIKE :search', { search: `%${search}%` });
    }
    if (typeof minPrice === 'number') {
      qb.andWhere('task.price >= :minPrice', { minPrice });
    }
    if (typeof maxPrice === 'number') {
      qb.andWhere('task.price <= :maxPrice', { maxPrice });
    }
    if (categorySlugs && categorySlugs.length > 0) {
      qb.andWhere('category.slug IN (:...categorySlugs)', { categorySlugs });
    } else if (categoryUuid) {
      qb.andWhere('task.category_uuid = :categoryUuid', { categoryUuid });
    }
    if (complexities && complexities.length > 0) {
      qb.andWhere('task.complexity IN (:...complexities)', { complexities });
    } else if (complexity) {
      qb.andWhere('task.complexity = :complexity', { complexity });
    }
    if (isDraft !== undefined) {
      const isDraftBool =
        typeof isDraft === 'boolean'
          ? isDraft
          : String(isDraft).toLowerCase() === 'true';
      qb.andWhere('task.isDraft = :isDraft', { isDraft: isDraftBool });
    }

    // Always add respondes count for all tasks
    qb.addSelect(
      (subQb) =>
        subQb
          .select('COUNT(r.uuid)')
          .from('respondes', 'r')
          .where('r.task_uuid = task.uuid'),
      'respondes_count',
    );

    if (orderBy === 'createdAtAsc') {
      qb.orderBy('task.createdAt', 'ASC');
    } else if (orderBy === 'createdAtDesc') {
      qb.orderBy('task.createdAt', 'DESC');
    } else if (orderBy === 'priceAsc') {
      qb.orderBy('task.price', 'ASC');
    } else if (orderBy === 'priceDesc') {
      qb.orderBy('task.price', 'DESC');
    } else if (orderBy === 'respondesCountAsc') {
      qb.orderBy('respondes_count', 'ASC');
    } else if (orderBy === 'respondesCountDesc') {
      qb.orderBy('respondes_count', 'DESC');
    }

    if (typeof skip === 'number') qb.skip(skip);
    if (typeof take === 'number') qb.take(take);

    // Create a separate query builder for count
    const countQb = this.taskRepository
      .createQueryBuilder('task')
      .leftJoin('task.category', 'category')
      .leftJoin('task.user', 'user');

    if (my === true) {
      countQb.where('task.user_uuid = :userUuid', { userUuid });
    }

    if (search) {
      countQb.andWhere('task.title ILIKE :search', { search: `%${search}%` });
    }
    if (typeof minPrice === 'number') {
      countQb.andWhere('task.price >= :minPrice', { minPrice });
    }
    if (typeof maxPrice === 'number') {
      countQb.andWhere('task.price <= :maxPrice', { maxPrice });
    }
    if (categorySlugs && categorySlugs.length > 0) {
      countQb.andWhere('category.slug IN (:...categorySlugs)', {
        categorySlugs,
      });
    } else if (categoryUuid) {
      countQb.andWhere('task.category_uuid = :categoryUuid', { categoryUuid });
    }
    if (complexities && complexities.length > 0) {
      countQb.andWhere('task.complexity IN (:...complexities)', {
        complexities,
      });
    } else if (complexity) {
      countQb.andWhere('task.complexity = :complexity', { complexity });
    }
    if (isDraft !== undefined) {
      const isDraftBool =
        typeof isDraft === 'boolean'
          ? isDraft
          : String(isDraft).toLowerCase() === 'true';
      countQb.andWhere('task.isDraft = :isDraft', { isDraft: isDraftBool });
    }

    const { entities: tasks, raw: rawResults } = await qb.getRawAndEntities();
    const total = await countQb.getCount();
    const page = Math.floor(skip / take) + 1;

    // Map respondes_count from raw results to tasks
    const tasksWithCounts = tasks.map((task, index) => {
      const rawResult = rawResults[index];
      return {
        ...task,
        respondesCount: rawResult
          ? parseInt(rawResult.respondes_count || '0', 10)
          : 0,
      };
    });

    for (const task of tasksWithCounts) {
      task.category = await this.appService.finOneCategory(
        task.category.slug,
        lang,
      );
    }
    return {
      tasks: tasksWithCounts,
      total,
      page,
    };
  }

  async findOne(uuid: string, lang: string, userUuid?: string): Promise<Task> {
    // Load minimal relations first to decide whether to fetch respondes
    let task = await this.taskRepository.findOneOrFail({
      where: { uuid },
      relations: ['files', 'category', 'user'],
    });

    // Get respondes count using query builder
    const qb = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.files', 'files')
      .leftJoinAndSelect('task.category', 'category')
      .leftJoinAndSelect('task.user', 'user')
      .where('task.uuid = :uuid', { uuid })
      .addSelect(
        (subQb) =>
          subQb
            .select('COUNT(r.uuid)')
            .from('respondes', 'r')
            .where('r.task_uuid = task.uuid'),
        'respondes_count',
      );

    if (userUuid && task.user && task.user.uuid === userUuid) {
      // Owner: include respondes and respondes.user
      qb.leftJoinAndSelect('task.respondes', 'respondes').leftJoinAndSelect(
        'respondes.user',
        'respondesUser',
      );
    }

    const { entities, raw } = await qb.getRawAndEntities();
    const taskWithCount = entities[0];
    const rawResult = raw[0];

    return {
      ...taskWithCount,
      respondesCount: rawResult
        ? parseInt(rawResult.respondes_count || '0', 10)
        : 0,
      category: await this.appService.finOneCategory(
        taskWithCount.category.slug,
        lang,
      ),
    };
  }

  async update(
    uuid: string,
    updateTaskDto: UpdateTaskDto,
    files: Express.Multer.File[],
  ): Promise<Task> {
    const task = await this.taskRepository.findOneOrFail({
      where: { uuid },
    });
    if (files) {
      for (const file of files) {
        const uploaded = await this.storageService.uploadFile(file);
        const taskFile = this.taskFileRepository.create({
          url: uploaded.url,
          name: uploaded.name,
          type: 'file',
          task,
        });
        await this.taskFileRepository.save(taskFile);
      }
    }
    // sanitize incoming dto: skip undefined values; map categoryUuid -> category
    const {
      categoryUuid,
      files: _ignoredFiles,
      ...restDto
    } = updateTaskDto as any;
    const cleanedDto = Object.fromEntries(
      Object.entries(restDto).filter(([, value]) => value !== undefined),
    ) as Record<string, unknown>;
    if (categoryUuid !== undefined) {
      Object.assign(cleanedDto, { category: { uuid: categoryUuid } });
    }
    const savedTask = await this.taskRepository.save({
      ...task,
      ...cleanedDto,
    });
    return await this.taskRepository.findOneOrFail({
      where: { uuid: savedTask.uuid },
      relations: ['files', 'category'],
    });
  }

  async remove(uuid: string): Promise<StatusOkDto> {
    await this.taskRepository.delete(uuid);
    return new StatusOkDto();
  }
}
