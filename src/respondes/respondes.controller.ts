import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { RespondesService } from './respondes.service';
import { CreateRespondDto } from './dto/create-respond.dto';
import { Respond } from './entities/respond.entity';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { PaginateParamsDto } from 'src/common/params/paginate.params.dto';
import { StatusOkDto } from 'src/common/dto/success.dto';
import { UpdateRespondDto } from './dto/update-respond.dto';

@Controller('respondes')
export class RespondesController {
  constructor(private readonly respondesService: RespondesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  async create(
    @Body() createRespondDto: CreateRespondDto,
    @CurrentUser() user: User,
  ): Promise<Respond> {
    return await this.respondesService.create(createRespondDto, user.uuid);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  async findAll(
    @Query() paginateParams: PaginateParamsDto,
  ): Promise<Respond[]> {
    return await this.respondesService.findAll(paginateParams);
  }

  @Get(':uuid')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  async findOne(@Param('uuid') uuid: string): Promise<Respond> {
    return await this.respondesService.findOne(uuid);
  }

  @Patch(':uuid')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  async update(
    @Param('uuid') uuid: string,
    @Body() updateRespondDto: UpdateRespondDto,
  ): Promise<Respond> {
    return await this.respondesService.update(uuid, updateRespondDto);
  }

  @Delete(':uuid')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  async remove(@Param('uuid') uuid: string): Promise<StatusOkDto> {
    return await this.respondesService.remove(uuid);
  }
}
