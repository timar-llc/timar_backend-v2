import { IsDate } from 'class-validator';

export class UpdateNotificationDto {
  @IsDate()
  readedAt: Date;
}
