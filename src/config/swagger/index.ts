import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import metadata from 'src/metadata';

export const initSwagger = async (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('API ')
    .setDescription('TIMAR BACKEND')
    .setVersion('0.0.1')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'Bearer',
    )
    .build();
  await SwaggerModule.loadPluginMetadata(metadata);
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, doc);
};
