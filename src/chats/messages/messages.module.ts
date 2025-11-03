import { forwardRef, Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { ChatsModule } from '../chats.module';
import { MessageAttachement } from './entities/messageAttachement.entity';
import { StorageModule } from 'src/config/s3/s3.module';

@Module({
  imports: [
    StorageModule,
    TypeOrmModule.forFeature([Message, MessageAttachement]),
    forwardRef(() => ChatsModule),
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
