import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { StorageService } from 'src/config/s3/s3.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectMedia } from './entities/projectMedia.entity';
import { PaginateParamsDto } from 'src/common/params/paginate.params.dto';
import { User } from 'src/users/entities/user.entity';
import { ProjectParamsDto } from './params/project.params.dto';
import { Category } from 'src/common/entities/category.entity';
import { UpdateProjectDto } from './dto/update-project.dto';
import { StatusOkDto } from 'src/common/dto/success.dto';
import { AppService } from 'src/app.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectMedia)
    private readonly projectMediaRepository: Repository<ProjectMedia>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly storageService: StorageService,
    private readonly appService: AppService,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    files: Express.Multer.File[],
    userUuid: string,
  ): Promise<Project> {
    const user = await this.userRepository.findOneOrFail({
      where: { uuid: userUuid },
    });
    let category: Category | undefined;
    if (createProjectDto.categoryUuid) {
      category = await this.categoryRepository.findOneOrFail({
        where: { uuid: createProjectDto.categoryUuid },
      });
    }

    // Очищаем пустые строки и преобразуем в undefined для числовых полей

    const project = this.projectRepository.create({
      ...createProjectDto,
      category,

      currency: 'RUB',
      user,
    });
    const savedProject = await this.projectRepository.save(project);
    if (files) {
      for (const file of files) {
        const uploaded = await this.storageService.uploadFile(file);
        const projectMedia = this.projectMediaRepository.create({
          url: uploaded.url,
          type: 'image',
          project,
        });
        await this.projectMediaRepository.save(projectMedia);
      }
    }
    return await this.projectRepository.findOneOrFail({
      where: { uuid: savedProject.uuid },
      relations: ['media', 'category'],
    });
  }

  async findOne(uuid: string): Promise<Project> {
    return await this.projectRepository.findOneOrFail({
      where: { uuid },
      relations: ['media', 'category'],
    });
  }

  async findAll(projectParamsDto: ProjectParamsDto): Promise<Project[]> {
    const { skip, take, search, categoryUuid, userUuid, lang, ...params } =
      projectParamsDto;

    let where: FindOptionsWhere<Project> = {};

    // Добавляем поиск по title только если search передан
    if (search) {
      where.title = Like(`%${search}%`);
    }

    // Добавляем остальные параметры фильтрации
    if (params) {
      where = { ...where, ...params };
    }

    where.user = { uuid: userUuid };

    // Добавляем фильтр по категории
    if (categoryUuid) {
      try {
        where.category = { uuid: categoryUuid };
      } catch (error) {
        throw new NotFoundException('Category not found');
      }
    }

    const projects = await this.projectRepository.find({
      skip,
      take,
      relations: ['media', 'category', 'category.parent'],
      where,
    });
    for (const project of projects) {
      project.category = await this.appService.finOneCategory(
        project.category.slug,
        lang ?? 'en',
      );
    }
    return projects;
  }

  async update(
    uuid: string,
    updateProjectDto: UpdateProjectDto,
    files: Express.Multer.File[],
    userUuid: string,
  ): Promise<Project> {
    const user = await this.userRepository.findOneOrFail({
      where: { uuid: userUuid },
    });

    const project = await this.projectRepository.findOneOrFail({
      where: { uuid },
    });

    if (files) {
      for (const file of files) {
        const uploaded = await this.storageService.uploadFile(file);
        const projectMedia = this.projectMediaRepository.create({
          url: uploaded.url,
          type: 'image',
          project,
        });
        await this.projectMediaRepository.save(projectMedia);
      }
    }
    const savedProject = await this.projectRepository.save({
      ...project,
      ...updateProjectDto,
      user,
    });

    return await this.projectRepository.findOneOrFail({
      where: { uuid: savedProject.uuid },
      relations: ['media', 'category'],
    });
  }

  async delete(uuid: string): Promise<StatusOkDto> {
    await this.projectRepository.delete(uuid);
    return new StatusOkDto();
  }
}
