import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { ChatsService } from '../chats.service';
import { Chat } from '../entities/chat.entity';
import { MessageDto } from './dto/message.dto';
import { MessageAttachement } from './entities/messageAttachement.entity';
import { StorageService } from 'src/config/s3/s3.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(MessageAttachement)
    private messageAttachmentRepository: Repository<MessageAttachement>,
    private chatsService: ChatsService,
    private storageService: StorageService,
  ) {}

  async create(dto: any, userUuid: string): Promise<Message> {
    const message = this.messageRepository.create({
      chat: { uuid: dto.chatUuid },
      sender: { uuid: userUuid },
    });
    return await this.messageRepository.save(message);
  }

  async sendTextMessage(dto: MessageDto, userUuid: string): Promise<Message> {
    const message = this.messageRepository.create({
      chat: { uuid: dto.chatUuid },
      sender: { uuid: userUuid },
      content: dto.content,
      type: 'text',
    });
    const savedMessage = await this.messageRepository.save(message);
    if (dto.attachments && dto.attachments.length > 0) {
      for (const file of dto.attachments) {
        const uploaded = await this.storageService.uploadFile(file);
        const attachment = this.messageAttachmentRepository.create({
          message: savedMessage,
          url: uploaded.url,
          type: 'file',
        });
        await this.messageAttachmentRepository.save(attachment);
      }
    }
    return savedMessage;
  }

  async sendAudioMessage(dto: MessageDto, userUuid: string): Promise<Message> {
    const message = this.messageRepository.create({
      chat: { uuid: dto.chatUuid },
      sender: { uuid: userUuid },
      content: dto.content,
      type: 'audio',
    });
    const savedMessage = await this.messageRepository.save(message);
    if (dto.attachments && dto.attachments.length > 0) {
      for (const file of dto.attachments) {
        const uploaded = await this.storageService.uploadFile(file);
        const attachment = this.messageAttachmentRepository.create({
          message: savedMessage,
          url: uploaded.url,
          type: 'file',
        });
        await this.messageAttachmentRepository.save(attachment);
      }
    }
    return savedMessage;
  }

  async sendOfferMessage(dto: MessageDto, userUuid: string): Promise<Message> {
    let chat: Chat;
    if (dto.chatUuid) {
      chat = await this.chatsService.findOne(dto.chatUuid);
    } else {
      if (dto.senderUuid === userUuid) {
        throw new BadRequestException('You cannot send an offer to yourself');
      }
      chat = await this.chatsService.findOrCreate(userUuid, dto.senderUuid);
    }
    const message = this.messageRepository.create({
      chat,
      sender: { uuid: userUuid },
      content: dto.content,
      type: 'offer',
      metadata: {
        price: dto.metadata?.price,
        duration: dto.metadata?.duration,
      },
    });
    const saved = await this.messageRepository.save(message);

    return saved;
  }
  async markMessageAsRead(messageUuid: string): Promise<boolean> {
    const message = await this.messageRepository.findOne({
      where: { uuid: messageUuid },
      relations: ['chat'],
    });
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    if (message.readedAt) {
      // already marked as read
      return false;
    }
    message.readedAt = new Date();
    await this.messageRepository.save(message);
    return true;
  }

  async findOne(uuid: string): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { uuid },
      relations: ['attachments', 'sender'],
    });
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    return message;
  }
}
