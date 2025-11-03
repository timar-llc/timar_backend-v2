import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { ChatsService } from 'src/chats/chats.service';
import { MessagesService } from 'src/chats/messages/messages.service';
import { RespondesService } from 'src/respondes/respondes.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private readonly respondesService: RespondesService,
    private readonly chatsService: ChatsService,
    private readonly messagesService: MessagesService,
    private readonly usersService: UsersService,
  ) {}

  async createFromRespond(
    respondUuid: string,
    userUuid: string,
  ): Promise<Order> {
    if (!respondUuid) {
      throw new BadRequestException('respondUuid is required');
    }
    const respond = await this.respondesService.findOne(respondUuid);
    const chat = await this.chatsService.findOrCreate(
      userUuid,
      respond.user.uuid,
    );
    await this.messagesService.createRespondMessage(
      {
        chatUuid: chat.uuid,
        respondUuid: respond.uuid,
        price: respond.price,
        duration: respond.duration,
        currency: respond.task.currency,
        description: respond.coverLetter,
      },
      userUuid,
    );
    const order = await this.orderRepository.create({
      respond: { uuid: respond.uuid },
      client: { uuid: userUuid },
      freelancer: { uuid: respond.user.uuid },
      task: { uuid: respond.task.uuid },
      price: respond.price,
      duration: respond.duration,
      currency: respond.task.currency,
    });
    return await this.orderRepository.save(order);
  }

  async accept(orderUuid: string, userUuid: string): Promise<Order> {
    const order = await this.orderRepository.findOneOrFail({
      where: { uuid: orderUuid },
    });
    const user = await this.usersService.findOne(userUuid);
    if (order.freelancer.uuid !== userUuid && order.client.uuid !== userUuid) {
      throw new BadRequestException('You are not allowed to accept this order');
    }
    order.status = 'active';
    if (order.freelancer && order.freelancer.uuid !== userUuid) {
      order.freelancer = user;
    } else {
      order.client = user;
    }
    return await this.orderRepository.save(order);
  }
}
