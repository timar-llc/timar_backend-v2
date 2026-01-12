import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { PaginateParamsDto } from 'src/common/params/paginate.params.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  async findAll(
    @CurrentUser() user: User,
    @Query() paginateParamsDto: PaginateParamsDto & { lang: string },
  ): Promise<Notification[]> {
    return await this.notificationsService.findAll(
      paginateParamsDto,
      user.uuid,
      paginateParamsDto.lang,
    );
  }

  @Patch(':uuid')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  async update(
    @Param('uuid') uuid: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(uuid, updateNotificationDto);
  }
}
