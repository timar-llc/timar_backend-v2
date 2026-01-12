import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  async findAll(@CurrentUser() user: User, @Query('lang') lang: string) {
    return this.achievementsService.findAll(user.uuid, lang);
  }
}
