import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStats, UserWithStats } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { FreelancersParamsDto } from './dto/freelancers-params.dto';
import { Project } from 'src/projects/entities/project.entity';
import { StorageService } from 'src/config/s3/s3.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly storageService: StorageService,
  ) {}

  async getMe(uuid: string): Promise<User> {
    const user = await this.findOne(uuid);
    return user as User;
  }

  async getUserStats(uuid: string): Promise<UserStats> {
    const user = await this.userRepository.findOne({
      where: { uuid },
      relations: ['orders', 'completedOrders'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const totalOrders = user.orders.length;
    const completedOrders = user.completedOrders.filter(
      (order) => order.status === 'completed',
    ).length;
    const satisfiedClientsPercentage = 100;
    const totalIncome = user.completedOrders
      .filter((order) => order.status === 'completed')
      .reduce((acc, order) => acc + order.price, 0);
    return {
      totalOrders,
      completedOrders,
      satisfiedClientsPercentage,
      totalIncome,
    };
  }

  async findOne(
    uuid: string,
    withStats: boolean = false,
  ): Promise<User | UserWithStats> {
    const user = await this.userRepository.findOne({
      where: { uuid },
      relations: ['orders', 'completedOrders'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (withStats) {
      return { user: user as User, stats: await this.getUserStats(uuid) };
    }
    return user;
  }

  async updateMe(uuid: string, updateMeDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { uuid } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const merged = { ...user, ...updateMeDto };
    const profileCompleteness = this.calculateProfileCompleteness(merged);
    await this.userRepository.save({ ...merged, profileCompleteness });
    return (await this.findOne(uuid, false)) as User;
  }

  private calculateProfileCompleteness(user: Partial<User>): number {
    // Поля, которые считаем обязательными для заполнения профиля
    const fieldsToCheck: (keyof User)[] = [
      'firstName',
      'lastName',
      'username',
      'avatarUrl',
      'specialization',
      'technologies',
      'cv',
      'phoneNumber',
    ];

    const total = fieldsToCheck.length;
    const filled = fieldsToCheck.filter((field) => {
      const value = user[field];
      return (
        value !== undefined && value !== null && String(value).trim() !== ''
      );
    }).length;

    return Math.round((filled / total) * 100);
  }

  async getFreelancers(params: FreelancersParamsDto, userUuid: string) {
    const {
      take = 10,
      skip = 0,
      search,
      minRating,
      maxRating,
      specialization,
      skills,
      orderBy,
    } = params;

    // First, get user UUIDs that match the criteria
    const userUuidsSubQuery = this.userRepository
      .createQueryBuilder('user')
      .innerJoin(
        'user.projects',
        'project',
        'project.isDraft = false AND project.isActive = true',
      )
      // .andWhere('user.uuid != :userUuid', { userUuid })
      .select('DISTINCT(user.uuid)', 'uuid');

    if (search) {
      userUuidsSubQuery.andWhere(
        '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.username ILIKE :search OR user.specialization ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (minRating !== undefined) {
      userUuidsSubQuery.andWhere('user.rating >= :minRating', { minRating });
    }

    if (maxRating !== undefined) {
      userUuidsSubQuery.andWhere('user.rating <= :maxRating', { maxRating });
    }

    if (specialization) {
      userUuidsSubQuery.andWhere('user.specialization = :specialization', {
        specialization,
      });
    }

    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : [skills];
      const skillsConditions = skillsArray
        .map((_, index) => `project.technologies ILIKE :skill${index}`)
        .join(' OR ');
      userUuidsSubQuery.andWhere(`(${skillsConditions})`, {
        ...Object.fromEntries(
          skillsArray.map((skill, index) => [`skill${index}`, `%${skill}%`]),
        ),
      });
    }

    const userUuids = await userUuidsSubQuery.getRawMany();
    const uuids = userUuids.map((u) => u.uuid);

    if (uuids.length === 0) {
      return {
        data: [],
        total: 0,
        take,
        skip,
      };
    }

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.country', 'country')
      .where('user.uuid IN (:...uuids)', { uuids });

    if (orderBy) {
      switch (orderBy) {
        case 'ratingDesc':
          queryBuilder.orderBy('user.rating', 'DESC');
          break;
        case 'ratingAsc':
          queryBuilder.orderBy('user.rating', 'ASC');
          break;
        case 'createdAtDesc':
          queryBuilder.orderBy('user.createdAt', 'DESC');
          break;
        case 'createdAtAsc':
          queryBuilder.orderBy('user.createdAt', 'ASC');
          break;
        case 'priceAsc':
          queryBuilder
            .addSelect(
              (subQb) =>
                subQb
                  .select('COALESCE(AVG(p.price), 0)')
                  .from('projects', 'p')
                  .where('p.user_uuid = user.uuid')
                  .andWhere('p.is_draft = false')
                  .andWhere('p.is_active = true'),
              'avg_price',
            )
            .orderBy('avg_price', 'ASC');
          break;
        case 'priceDesc':
          queryBuilder
            .addSelect(
              (subQb) =>
                subQb
                  .select('COALESCE(AVG(p.price), 0)')
                  .from('projects', 'p')
                  .where('p.user_uuid = user.uuid')
                  .andWhere('p.is_draft = false')
                  .andWhere('p.is_active = true'),
              'avg_price',
            )
            .orderBy('avg_price', 'DESC');
          break;
      }
    } else {
      queryBuilder.orderBy('user.rating', 'DESC');
    }

    const [users, total] = await Promise.all([
      queryBuilder.take(take).skip(skip).getMany(),
      Promise.resolve(uuids.length),
    ]);

    // Load projects for each user
    const usersWithProjects = await Promise.all(
      users.map(async (user) => {
        const projects = await this.projectRepository.find({
          where: {
            user: { uuid: user.uuid },
            isDraft: false,
            isActive: true,
          },
        });
        return { ...user, projects };
      }),
    );

    return {
      data: usersWithProjects,
      total,
      take,
      skip,
    };
  }

  async uploadAvatar(
    uuid: string,
    avatar: Express.Multer.File | undefined,
  ): Promise<User> {
    const user = (await this.findOne(uuid)) as User;
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!avatar) {
      user.avatarUrl = '';
      await this.userRepository.update(uuid, { avatarUrl: user.avatarUrl });
      return (await this.findOne(uuid)) as User;
    }
    if (!avatar.buffer.length) {
      throw new BadRequestException('Avatar is empty');
    }
    const uploaded = await this.storageService.uploadFile(avatar);
    await this.userRepository.update(uuid, { avatarUrl: uploaded.url });
    return (await this.findOne(uuid)) as User;
  }
}
