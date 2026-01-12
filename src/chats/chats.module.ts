import { forwardRef, Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { MessagesModule } from './messages/messages.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { ChatGateway } from './chats.gateway';
import { User } from 'src/users/entities/user.entity';
import { OrdersModule } from 'src/orders/orders.module';
import { Message } from './messages/entities/message.entity';
@Module({
  controllers: [ChatsController],
  providers: [ChatsService, ChatGateway],
  imports: [
    MessagesModule,
    TypeOrmModule.forFeature([Chat, User, Message]),
    forwardRef(() => OrdersModule),
  ],
  exports: [ChatsService],
})
export class ChatsModule {}
