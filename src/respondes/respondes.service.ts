import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Respond } from './entities/respond.entity';
import { CreateRespondDto } from './dto/create-respond.dto';
import { User } from 'src/users/entities/user.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { UpdateRespondDto } from './dto/update-respond.dto';
import { PaginateParamsDto } from 'src/common/params/paginate.params.dto';
import { StatusOkDto } from 'src/common/dto/success.dto';

@Injectable()
export class RespondesService {
  constructor(
    @InjectRepository(Respond)
    private respondRepository: Repository<Respond>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    createRespondDto: CreateRespondDto,
    userUuid: string,
  ): Promise<Respond> {
    const existingRespond = await this.respondRepository.findOne({
      where: {
        task: { uuid: createRespondDto.taskUuid },
        user: { uuid: userUuid },
      },
    });
    if (existingRespond) {
      throw new BadRequestException('You have already responded to this task');
    }
    const respond = this.respondRepository.create(createRespondDto);
    const task = await this.taskRepository.findOneOrFail({
      where: { uuid: createRespondDto.taskUuid },
    });
    const user = await this.userRepository.findOneOrFail({
      where: { uuid: userUuid },
    });
    respond.task = task;
    respond.user = user;
    return await this.respondRepository.save(respond);
  }

  async findAll(paginateParams: PaginateParamsDto): Promise<Respond[]> {
    return await this.respondRepository.find({
      ...paginateParams,
      relations: ['task', 'user'],
    });
  }

  async findOne(uuid: string): Promise<Respond> {
    return await this.respondRepository.findOneOrFail({
      where: { uuid },
      relations: ['task', 'user'],
    });
  }

  async update(
    uuid: string,
    updateRespondDto: UpdateRespondDto,
  ): Promise<Respond> {
    const respond = await this.respondRepository.findOneOrFail({
      where: { uuid },
    });
    return await this.respondRepository.save({
      ...respond,
      ...updateRespondDto,
    });
  }

  async remove(uuid: string): Promise<StatusOkDto> {
    const result = await this.respondRepository.delete(uuid);
    if (!result.affected) {
      throw new NotFoundException('Respond not found');
    }
    return new StatusOkDto();
  }
}
