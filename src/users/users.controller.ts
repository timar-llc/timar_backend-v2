import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserWithStats } from './entities/user.entity';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { FreelancersParamsDto } from './dto/freelancers-params.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { HeleketPaymentRequestDto } from 'src/payments/heleket/heleket.interface';
import { HeleketService } from 'src/payments/heleket/heleket.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly heleketService: HeleketService,
  ) {}

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  async getMe(@CurrentUser() user: User): Promise<User> {
    return await this.usersService.getMe(user.uuid);
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

  @Get('freelancers')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  async getFreelancers(
    @Query() params: FreelancersParamsDto,
    @CurrentUser() user: User,
  ): Promise<{ data: User[]; total: number; take: number; skip: number }> {
    return this.usersService.getFreelancers(params, user.uuid);
  }

  @Get(':uuid')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  @ApiQuery({ name: 'withStats', type: Boolean, required: false })
  async findOne(
    @Param('uuid') uuid: string,
    @Query('withStats') withStats: boolean = false,
  ): Promise<User | UserWithStats> {
    return this.usersService.findOne(uuid, withStats);
  }
  @Post('avatar')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('avatar'))
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  async uploadAvatar(
    @CurrentUser() user: User,
    @UploadedFile() avatar: Express.Multer.File | undefined,
  ): Promise<User> {
    return this.usersService.uploadAvatar(user.uuid, avatar);
  }

  @Post('test-payment')
  async testPayment(@Body() dto: HeleketPaymentRequestDto) {
    return this.heleketService.getExchangeRate();
  }
}
