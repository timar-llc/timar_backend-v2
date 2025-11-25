// src/chat/chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Injectable, Logger } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { MessagesService } from './messages/messages.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3002',
    credentials: true,
  },
  namespace: '/ws',
})
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly chatsService: ChatsService,
    private readonly messagesService: MessagesService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async handleConnection(client: Socket) {
    try {
      // Получаем токен из query параметров
      const token = client.handshake.auth.token as string;

      if (!token) {
        this.logger.warn('No token provided');
        client.disconnect();
        return;
      }

      // Валидируем токен
      const payload = await this.jwtService.verifyAsync(token);
      const userUuid = payload.sub;
      const user = await this.userRepository.findOne({
        where: { uuid: userUuid },
      });
      if (!user) {
        this.logger.warn('User not found');
        client.disconnect();
        return;
      }
      user.isOnline = true;

      user.lastOnlineAt = new Date();
      await this.userRepository.save(user);
      console.log('userUuid', userUuid);
      const chats = await this.chatsService.findAll(userUuid, {
        skip: 0,
        take: 100,
      });
      for (const chat of chats) {
        console.log(' join to chat', chat.uuid);
        await client.join(`chat_${chat.uuid}`);
      }

      // Сохраняем связь socketId -> userId

      // Присоединяем пользователя к его личной комнате
      await client.join(`user_${userUuid}`);

      // Уведомляем о подключении
      this.server.emit('user_online_status', {
        userUuid: userUuid,
        isOnline: true,
      });

      this.logger.log(`User ${userUuid} connected with socket ${client.id}`);
    } catch (error) {
      this.logger.error('Connection error:', error);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const token = client.handshake.auth.token as string;
    const payload = await this.jwtService.verifyAsync(token);
    const userUuid = payload.sub;
    const user = await this.userRepository.findOne({
      where: { uuid: userUuid },
    });
    const chats = await this.chatsService.findAll(userUuid, {
      skip: 0,
      take: 100,
    });
    for (const chat of chats) {
      console.log(' leave from chat', chat.uuid);
      await client.leave(`chat_${chat.uuid}`);
    }
    if (!user) {
      this.logger.warn('User not found');
      client.disconnect();
      return;
    }
    user.isOnline = false;
    user.lastOnlineAt = new Date();
    await this.userRepository.save(user);
    // Уведомляем об отключении
    this.server.emit('user_online_status', {
      userUuid: userUuid,
      isOnline: false,
      lastSeen: new Date().toISOString(),
    });

    this.logger.log(`User ${userUuid} disconnected`);
    client.disconnect();
    return;
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody()
    data: {
      chatUuid: string;
      messageUuid: string;
      content: string;
      senderUuid: string;
      replyToUuid?: string;
      metadata?: {
        price?: number;
        duration?: number;
      };
      type: 'text' | 'audio' | 'offer';
      attachments?: { filename: string; mimetype: string; content: string }[]; // content: base64
    },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const token = client.handshake.auth.token as string;
      const payload = await this.jwtService.verifyAsync(token);
      const userUuid = payload.sub;
      // Подготовка вложений (если пришли) в вид, совместимый с Express.Multer.File
      const attachments = (data.attachments || []).map((a) => ({
        originalname: a.filename,
        mimetype: a.mimetype,
        buffer: Buffer.from(a.content, 'base64'),
      })) as unknown as Express.Multer.File[];

      // Сохраняем сообщение в базе данных в зависимости от типа
      let savedMessage = null as any;
      if (data.type === 'offer') {
        savedMessage = await this.messagesService.sendOfferMessage(
          {
            chatUuid: data.chatUuid,
            messageUuid: data.messageUuid,
            senderUuid: userUuid,
            content: data.content,
            metadata: data.metadata,
            type: data.type,
          },
          userUuid,
        );
      } else if (data.type === 'audio') {
        savedMessage = await this.messagesService.sendAudioMessage(
          {
            chatUuid: data.chatUuid,
            messageUuid: data.messageUuid,
            senderUuid: userUuid,
            type: data.type,
            content: data.content,
            attachments,
          },
          userUuid,
        );
      } else if (data.type === 'text') {
        savedMessage = await this.messagesService.sendTextMessage(
          {
            chatUuid: data.chatUuid,
            messageUuid: data.messageUuid,
            senderUuid: userUuid,
            content: data.content,
            type: data.type,
            attachments,
          },
          userUuid,
        );
        console.log('savedMessage', savedMessage);
      }

      console.log('savedMessage', savedMessage);
      const resultMessage = await this.messagesService.findOne(
        savedMessage.uuid,
      );
      // Отправляем сообщение всем участникам чата
      this.server.to(`chat_${data.chatUuid}`).emit('message_received', {
        uuid: resultMessage.uuid,
        chatUuid: data.chatUuid,
        content: resultMessage.content,
        senderUuid: userUuid,
        type: resultMessage.type,
        createdAt: resultMessage.createdAt.toISOString(),
        metadata: resultMessage.metadata,
        attachments: resultMessage.attachments,
      });

      this.logger.log(
        `Message sent in chat ${data.chatUuid} by user ${userUuid}`,
      );
    } catch (error) {
      this.logger.error('Message handling error:', error);
      client.emit('error', { message: 'Failed to send message' });
    }
  }

  @SubscribeMessage('typing')
  async handleTyping(
    @MessageBody()
    data: {
      chatUuid: string;
      userUuid: string;
      isTyping: boolean;
    },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const token = client.handshake.auth.token as string;
      const payload = await this.jwtService.verifyAsync(token);
      const userUuid = payload.sub;

      this.server.to(`chat_${data.chatUuid}`).emit('user_typing', {
        chatUuid: data.chatUuid,
        userUuid: data.userUuid,
        isTyping: data.isTyping,
      });

      this.logger.log(
        `User ${userUuid} ${data.isTyping ? 'started' : 'stopped'} typing in chat ${data.chatUuid}`,
      );
    } catch (error) {
      this.logger.error('Typing handling error:', error);
    }
  }

  @SubscribeMessage('message_read')
  async handleMessageRead(
    @MessageBody()
    data: {
      chatUuid: string;
      messageUuid: string;
      timestamp: string;
    },
  ) {
    console.log('data', data);
    try {
      const updated = await this.messagesService.markMessageAsRead(
        data.messageUuid,
        data.timestamp,
      );
      if (!updated) {
        return; // уже прочитано, не дублируем событие
      }
      // Шлём только в комнату чата, не глобально
      this.server.to(`chat_${data.chatUuid}`).emit('message_read', {
        messageUuid: data.messageUuid,
        status: 'read',
        chatUuid: data.chatUuid,
        timestamp: new Date().toISOString(),
      });

      this.logger.log(
        `Message ${data.messageUuid} marked as read in chat ${data.chatUuid}`,
      );
    } catch (error) {
      this.logger.error('Message read error:', error);
    }
  }
}
