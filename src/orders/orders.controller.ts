import { Controller, Post, Body, UseGuards, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Order } from './entities/order.entity';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('from-respond/:respondUuid')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  async create(
    @Param('respondUuid') respondUuid: string,
    @CurrentUser() user: User,
  ): Promise<Order> {
    return await this.ordersService.createFromRespond(respondUuid, user.uuid);
  }

  @Post('accept/:orderUuid')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  async accept(
    @Param('orderUuid') orderUuid: string,
    @CurrentUser() user: User,
  ): Promise<Order> {
    return await this.ordersService.accept(orderUuid, user.uuid);
  }
}
