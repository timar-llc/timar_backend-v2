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
import { Order } from 'src/orders/entities/order.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(MessageAttachement)
    private messageAttachmentRepository: Repository<MessageAttachement>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
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
      uuid: dto.messageUuid,
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
      uuid: dto.messageUuid,
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
  async createRespondMessage(
    dto: MessageDto,
    userUuid: string,
  ): Promise<Message> {
    const message = this.messageRepository.create({
      uuid: dto.messageUuid,
      chat: { uuid: dto.chatUuid },
      sender: { uuid: userUuid },
      content: dto.content,
      type: 'offer',
      metadata: {
        price: dto.metadata?.price,
        duration: dto.metadata?.duration,
      },
    });
    return await this.messageRepository.save(message);
  }

  async sendOfferMessage(dto: MessageDto, userUuid: string): Promise<Message> {
    let chat: Chat;
    let receiverUuid: string | undefined;
    if (!dto.chatUuid && !dto.senderUuid) {
      throw new BadRequestException(
        'Either chatUuid or senderUuid must be provided',
      );
    }
    if (dto.chatUuid) {
      chat = await this.chatsService.findOne(dto.chatUuid);
      const participantUuids = [chat.user1?.uuid, chat.user2?.uuid];
      if (!participantUuids.includes(userUuid)) {
        throw new BadRequestException('You are not a participant of this chat');
      }
      receiverUuid =
        chat.user1?.uuid === userUuid ? chat.user2?.uuid : chat.user1?.uuid;
      if (!receiverUuid) {
        throw new BadRequestException('Chat participants are not defined');
      }
    } else {
      if (dto.senderUuid === userUuid) {
        throw new BadRequestException('You cannot send an offer to yourself');
      }
      receiverUuid = dto.senderUuid as string;
      chat = await this.chatsService.findOrCreate(userUuid, receiverUuid);
    }
    await this.ensureRoleCapacity(userUuid, receiverUuid);
    const message = this.messageRepository.create({
      uuid: dto.messageUuid,
      chat,
      sender: { uuid: userUuid },
      content: dto.content,
      type: dto.type ?? 'offer',
      metadata: {
        price: dto.metadata?.price,
        duration: dto.metadata?.duration,
      },
    });
    const saved = await this.messageRepository.save(message);

    return saved;
  }
  private async ensureRoleCapacity(
    clientUuid: string,
    freelancerUuid: string,
  ): Promise<void> {
    const clientsActiveOrder = await this.orderRepository.findOne({
      where: {
        client: { uuid: clientUuid },
        status: 'active',
      },
    });
    if (clientsActiveOrder) {
      throw new BadRequestException(
        'You already have an active order as a client',
      );
    }

    const freelancerActiveOrder = await this.orderRepository.findOne({
      where: {
        freelancer: { uuid: freelancerUuid },
        status: 'active',
      },
    });
    if (freelancerActiveOrder) {
      throw new BadRequestException(
        'This freelancer already has an active order',
      );
    }
  }
  async markMessageAsRead(
    messageUuid: string,
    timestamp: string,
  ): Promise<boolean> {
    const message = await this.messageRepository.findOne({
      where: { uuid: messageUuid },
      relations: ['chat'],
    });
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    if (
      message.readedAt &&
      message.readedAt.getTime() > new Date(timestamp).getTime()
    ) {
      // already marked as read
      return false;
    }
    message.readedAt = new Date(timestamp);
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

  async update(
    uuid: string,
    updateMessageDto: Partial<Message>,
  ): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { uuid },
    });
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    return await this.messageRepository.save({
      ...message,
      ...updateMessageDto,
    });
  }
}
