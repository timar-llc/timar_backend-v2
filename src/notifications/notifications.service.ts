import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { PaginateParamsDto } from 'src/common/params/paginate.params.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { I18nService } from 'nestjs-i18n';
import { WebSocketService } from 'src/common/services/websocket.service';
@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly webSocketService: WebSocketService,
    private readonly i18n: I18nService,
  ) {}
  async findAll(
    paginateParamsDto: PaginateParamsDto,
    userUuid: string,
    lang: string,
  ): Promise<Notification[]> {
    const { skip, take } = paginateParamsDto;
    const notifications = await this.notificationRepository.find({
      where: { user: { uuid: userUuid } },
      order: {
        createdAt: 'DESC',
      },
      skip,
      take,
    });
    return notifications.map((notification) => {
      // Use metadata for dynamic translations (e.g., amount)
      const translationArgs = notification.metadata || {};

      return {
        ...notification,
        description: this.i18n.translate(
          `notifications.${notification.slug}.description`,
          {
            lang,
            args: translationArgs,
          },
        ),
        title: this.i18n.translate(`notifications.${notification.slug}.title`, {
          lang,
        }),
      };
    });
  }
  async findOne(uuid: string) {
    const notification = await this.notificationRepository.findOne({
      where: { uuid },
    });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }
  async create(notification: Notification) {
    const savedNotification =
      await this.notificationRepository.save(notification);

    // Send notification to user via WebSocket

    return savedNotification;
  }
  async update(uuid: string, updateNotificationDto: UpdateNotificationDto) {
    const notification = await this.findOne(uuid);
    return this.notificationRepository.save({
      ...notification,
      ...updateNotificationDto,
    });
  }

  async createSuccessPaymentNotification(
    amount: number,
    userUuid: string,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      user: { uuid: userUuid },
      title: this.i18n.translate('notifications.top-up-balance.title', {
        lang: 'ru',
      }),
      slug: 'top-up-balance',
      description: this.i18n.translate(
        'notifications.top-up-balance.description',
        {
          lang: 'ru',
          args: { amount },
        },
      ),
      icon: 'success',
      metadata: { amount }, // Store amount for future translations
    });
    const savedNotification =
      await this.notificationRepository.save(notification);
    try {
      this.webSocketService.emitNotification(userUuid, savedNotification);
    } catch (error) {
      // Log error but don't fail the creation
      console.error('Failed to send notification via WebSocket:', error);
    }
    return savedNotification;
  }

  async createInitNotification(userUuid: string) {
    if (
      await this.notificationRepository.find({
        where: {
          user: {
            uuid: userUuid,
          },
        },
      })
    ) {
      return;
    }
    const notification = this.notificationRepository.create({
      user: { uuid: userUuid },
      title: this.i18n.translate(
        'notifications.welcome-to-the-platform.title',
        {
          lang: 'ru',
        },
      ),
      slug: 'welcome-to-the-platform',
      description: this.i18n.translate(
        'notifications.welcome-to-the-platform.description',
        {
          lang: 'ru',
        },
      ),
      icon: 'info',
    });
    return this.notificationRepository.save(notification);
  }
}
