import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { CreateNewsDto } from './dto/create-news.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginateParamsDto } from 'src/common/params/paginate.params.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}
  @Get()
  async findAll(@Query() paginateParamsDto: PaginateParamsDto) {
    return this.newsService.findAll(paginateParamsDto);
  }

  @Get(':uuid')
  async findOne(@Param('uuid') uuid: string) {
    return this.newsService.findOne(uuid);
  }
  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Bearer')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createNewsDto: CreateNewsDto,
    @UploadedFile() image: Express.Multer.File | undefined,
  ) {
    return this.newsService.create({ ...createNewsDto, image });
  }
}
