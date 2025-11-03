import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  async getMe(@CurrentUser() user: User): Promise<User> {
    return user;
  }

  @Patch('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  async updateMe(
    @CurrentUser() user: User,
    @Body() updateMeDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateMe(user.uuid, updateMeDto);
  }

  @Get(':uuid')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  async findOne(@Param('uuid') uuid: string): Promise<User> {
    return this.usersService.findOne(uuid);
  }
}
