import { Injectable, NotFoundException } from '@nestjs/common';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatParamsDto } from './params/chat.params.dto';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
  ) {}

  async create(dto: any, userUuid: string): Promise<Chat> {
    const chat = this.chatRepository.create({
      user1: { uuid: userUuid },
      user2: { uuid: dto.user2Uuid },
    });
    return await this.chatRepository.save(chat);
  }

  async findAll(
    userUuid: string,
    chatParamsDto: ChatParamsDto,
  ): Promise<Chat[]> {
    const { skip, take } = chatParamsDto;
    const chats = await this.chatRepository.find({
      where: [{ user1: { uuid: userUuid } }, { user2: { uuid: userUuid } }],
      order: {
        messages: {
          createdAt: 'DESC',
        },
      },
      relations: ['user1', 'user2', 'messages'],
    });
    return chats.slice(skip, skip + take);
  }

  async findOrCreate(user1Uuid: string, user2Uuid: string): Promise<Chat> {
    let chat = await this.chatRepository.findOne({
      where: [
        { user1: { uuid: user1Uuid }, user2: { uuid: user2Uuid } },
        { user1: { uuid: user2Uuid }, user2: { uuid: user1Uuid } },
      ],
    });
    if (!chat) {
      chat = this.chatRepository.create({
        user1: { uuid: user1Uuid },
        user2: { uuid: user2Uuid },
      });
      chat = await this.chatRepository.save(chat);
    }
    return chat;
  }

  async findOne(uuid: string): Promise<Chat> {
    const chat = await this.chatRepository.findOne({
      where: { uuid },
      relations: ['user1', 'user2', 'messages', 'messages.sender'],
      order: {
        messages: {
          createdAt: 'ASC',
        },
      },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    return chat;
  }
}
