import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Country } from './common/entities/country.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { countries } from './common/seed/countries.seed';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Category } from './common/entities/category.entity';
import { categories, getByParent } from './common/seed/categories.seed';
import { AchievementsService } from './achievements/achievements.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    private readonly i18n: I18nService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly achievementsService: AchievementsService,
  ) {}

  async onModuleInit() {
    if ((await this.countryRepository.count()) === 0) {
      const countriesList = countries.map((country) => {
        return this.countryRepository.create({
          title: country.name,
          code: country.code,
          slug: country.code.toLowerCase(),
        });
      });
      await this.countryRepository.save(countriesList);
    }
    if ((await this.categoryRepository.count()) === 0) {
      const parentCategories = await this.categoryRepository.save(categories);
      for (const parentCategory of parentCategories) {
        const subcategories = getByParent(parentCategory);
        if (subcategories) {
          await this.categoryRepository.save(subcategories);
        }
      }
    }
  }

  async findAllCountries(lang: string): Promise<Country[]> {
    const cacheKey = `countries:${lang}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as Country[];
    }
    const countriesDb = await this.countryRepository.find();
    const countries = countriesDb.map((country) => ({
      ...country,
      title: this.i18n.translate(`countries.${country.code}`, {
        lang: lang,
      }),
    }));
    await this.cacheManager.set(cacheKey, countries, 60 * 60 * 1);
    return countries;
  }

  async findAllCategories(lang: string): Promise<Category[]> {
    const cacheKey = `categories:${lang}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as Category[];
    }
    const categoriesDb = await this.categoryRepository.find({
      relations: ['subcategories'],
    });
    const categories = categoriesDb.map((category) => ({
      ...category,
      subcategories: category.subcategories.map((subcategory) => ({
        ...subcategory,
        title: this.i18n.translate(`categories.${subcategory.slug}`, {
          lang: lang,
        }),
      })),
      title: this.i18n.translate(`categories.${category.slug}`, {
        lang: lang,
      }),
    }));
    await this.cacheManager.set(cacheKey, categories, 60 * 60 * 1);
    return categories;
  }

  async finOneCategory(slug: string, lang: string): Promise<Category> {
    const category = await this.categoryRepository.findOneOrFail({
      where: { slug },
      relations: ['parent'],
    });
    return {
      ...category,
      title: this.i18n.translate(`categories.${category.slug}`, {
        lang: lang,
      }),
      parent: category.parent
        ? {
            ...category.parent,
            title: this.i18n.translate(`categories.${category.parent.slug}`, {
              lang: lang,
            }),
          }
        : null,
    };
  }
}
