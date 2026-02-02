import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './config/logger/logger.module';
import { LoggerService } from './config/logger/logger.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors/logger.interceptor';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './config/typeorm';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { AcceptLanguageResolver, QueryResolver, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { Country } from './common/entities/country.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { TasksModule } from './tasks/tasks.module';
import { RespondesModule } from './respondes/respondes.module';
import { OrdersModule } from './orders/orders.module';
import { OffersModule } from './offers/offers.module';
import { ChatsModule } from './chats/chats.module';
import { NewsModule } from './news/news.module';
import { ReviewsModule } from './reviews/reviews.module';
import { TransactionsModule } from './payments/transactions/transactions.module';
import { Category } from './common/entities/category.entity';
import { AchievementsModule } from './achievements/achievements.module';
import { NotificationsModule } from './notifications/notifications.module';
import { YookassaModule } from './payments/yookassa/yookassa.module';
import { HeleketModule } from './payments/heleket/heleket.module';
import { PaymentsModule } from './payments/payments.module';
import { WebSocketModule } from './common/services/websocket.module';

@Module({
  imports: [
    WebSocketModule,
    LoggerModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfig,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: process.env.NODE_ENV !== 'production',
      },
      resolvers: [new QueryResolver(['lang']), AcceptLanguageResolver],
    }),
    UsersModule,
    ProjectsModule,
    TypeOrmModule.forFeature([Country, Category]),
    CacheModule.register(),
    TasksModule,
    RespondesModule,
    OrdersModule,
    OffersModule,
    ChatsModule,
    NewsModule,
    ReviewsModule,
    TransactionsModule,
    AchievementsModule,
    NotificationsModule,
    YookassaModule,
    HeleketModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    LoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  exports: [AppService],
})
export class AppModule {}
