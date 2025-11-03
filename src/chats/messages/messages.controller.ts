import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Body } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { MessageDto } from './dto/message.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}
  @Post('offer')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('attachments', 10))
  async sendOfferMessage(
    @Body() dto: MessageDto,
    @CurrentUser() user: User,
  ) {
    return this.messagesService.sendOfferMessage(dto, user.uuid);
  }
}
