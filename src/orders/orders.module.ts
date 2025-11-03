import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Respond } from 'src/respondes/entities/respond.entity';
import { ChatsModule } from 'src/chats/chats.module';
import { MessagesModule } from 'src/chats/messages/messages.module';
import { RespondesModule } from 'src/respondes/respondes.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Respond]),
    ChatsModule,
    MessagesModule,
    RespondesModule,
    UsersModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
