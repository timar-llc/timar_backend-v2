import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Country } from './common/entities/country.entity';
import { Category } from './common/entities/category.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('countries')
  async getCountries(@Query('lang') lang: string): Promise<Country[]> {
    return await this.appService.findAllCountries(lang);
  }
  @Get('categories')
  async getCategories(@Query('lang') lang: string): Promise<Category[]> {
    return await this.appService.findAllCategories(lang);
  }
}
