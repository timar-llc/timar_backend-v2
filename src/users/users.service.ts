import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getMe(uuid: string): Promise<User> {
    console.log(uuid);
    const user = await this.findOne(uuid);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOne(uuid: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { uuid } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateMe(uuid: string, updateMeDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { uuid } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.save({ ...user, ...updateMeDto });
  }
}
