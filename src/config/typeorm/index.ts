import { TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export class TypeOrmConfig implements TypeOrmOptionsFactory {
  createTypeOrmOptions() {
    const configService = new ConfigService();
    return {
      type: 'postgres' as const,
      host: configService.get('DB_HOST'),
      port: configService.get('DB_PORT'),
      username: configService.get('DB_USER'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_NAME'),
      synchronize: true,
      entities: [__dirname + '/../../**/*.entity.{js,ts}'],
    };
  }
}
