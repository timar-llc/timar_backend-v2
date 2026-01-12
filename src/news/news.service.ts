import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNewsDto } from './dto/create-news.dto';
import { StorageService } from 'src/config/s3/s3.service';
import { PaginateParamsDto } from 'src/common/params/paginate.params.dto';
@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
    private readonly storageService: StorageService,
  ) {}
  async findAll(paginateParamsDto: PaginateParamsDto) {
    const { skip, take } = paginateParamsDto;
    return this.newsRepository.find({
      skip,
      take,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(uuid: string) {
    return this.newsRepository.findOne({
      where: { uuid },
    });
  }
  async create(createNewsDto: CreateNewsDto) {
    if (!createNewsDto.image) {
      throw new BadRequestException('Image file is required');
    }
    if (!createNewsDto.image.buffer || !createNewsDto.image.buffer.length) {
      throw new BadRequestException('Image file is empty');
    }
    const uploaded = await this.storageService.uploadFile(createNewsDto.image);
    const news = this.newsRepository.create({
      title: createNewsDto.title,
      description: createNewsDto.description,
      imageUrl: uploaded.url,
    });
    return this.newsRepository.save(news);
  }
}
