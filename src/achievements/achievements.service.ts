import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Achievement } from './entities/achievement.entity';
import { I18nService } from 'nestjs-i18n';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AchievementsService {
  constructor(
    @InjectRepository(Achievement)
    private readonly achievementRepository: Repository<Achievement>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly i18n: I18nService,
  ) {}

  async initUserAchievements(userUuid: string) {
    console.log('initUserAchievements', userUuid);
    const existingAchievements = await this.achievementRepository.find({
      where: {
        user: {
          uuid: userUuid,
        },
      },
    });
    if (existingAchievements.length > 0) {
      return;
    }
    const achievements = [
      {
        slug: 'confident-start',
        rarity: 'common',
        icon: 'noto:check-mark-button',
      },
      { slug: 'new-height', rarity: 'legendary', icon: 'noto:rocket' },
      {
        slug: 'first-order',
        rarity: 'common',
        icon: 'fluent-emoji-flat:money-with-wings',
      },
      { slug: 'first-review', rarity: 'rare', icon: 'fluent-emoji-flat:star' },

      { slug: 'team-player', rarity: 'rare', icon: 'twemoji:handshake' },
    ];
    const user = await this.userRepository.findOne({
      where: {
        uuid: userUuid,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    for (const achievement of achievements) {
      const achievementEntity = new Achievement();
      achievementEntity.user = user;
      achievementEntity.slug = achievement.slug;
      achievementEntity.rarity = achievement.rarity as
        | 'common'
        | 'rare'
        | 'epic'
        | 'legendary';
      achievementEntity.icon = achievement.icon;
      achievementEntity.title = this.i18n.translate(
        `achievements.${achievement.slug}.title`,
        {
          lang: 'ru',
        },
      );
      achievementEntity.description = this.i18n.translate(
        `achievements.${achievement.slug}.description`,
        {
          lang: 'ru',
        },
      );
      await this.achievementRepository.save(achievementEntity);
    }
  }

  async findAll(userUuid: string, lang: string) {
    const achievements = await this.achievementRepository.find({
      where: {
        user: {
          uuid: userUuid,
        },
      },
    });
    return achievements.map((achievement) => {
      return {
        ...achievement,
        title: this.i18n.translate(`achievements.${achievement.slug}.title`, {
          lang,
        }),
        description: this.i18n.translate(
          `achievements.${achievement.slug}.description`,
          {
            lang,
          },
        ),
      };
    });
  }
}
