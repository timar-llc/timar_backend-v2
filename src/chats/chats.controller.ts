import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Chat } from './entities/chat.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ChatParamsDto } from './params/chat.params.dto';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  @Get()
  async findAll(
    @CurrentUser() user: User,
    @Query() chatParamsDto: ChatParamsDto,
  ): Promise<Chat[]> {
    return await this.chatsService.findAll(user.uuid, chatParamsDto);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  @Get(':uuid')
  async findOne(@Param('uuid') uuid: string): Promise<Chat> {
    return await this.chatsService.findOne(uuid);
  }
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  @Get('participants/:uuids')
  async findByParticipantsIds(@Param('uuids') uuids: string): Promise<Chat[]> {
    return await this.chatsService.findByParticipantsIds(uuids.split(','));
  }
}
