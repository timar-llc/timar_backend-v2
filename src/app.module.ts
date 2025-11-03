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
import { NotificationModule } from './notification/notification.module';
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
import { PaymentMethodsModule } from './payments/payment-methods/payment-methods.module';
import { PayoutRequestsModule } from './payments/payout-requests/payout-requests.module';
import { Category } from './common/entities/category.entity';

@Module({
  imports: [
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
        watch: true,
      },
      resolvers: [new QueryResolver(['lang']), AcceptLanguageResolver],
    }),
    UsersModule,
    NotificationModule,
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
    PaymentMethodsModule,
    PayoutRequestsModule,
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
