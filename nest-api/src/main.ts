import { NestFactory } from '@nestjs/core';
import express from 'express';
import path from 'node:path';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addServer('http://localhost:3003')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const assetsDir =
    process.env.ASSETS_PNG_DIR ||
    path.resolve(process.cwd(), '..', 'DichVuSo-main', 'src', 'assets', 'png');

  app.use('/assets/png', express.static(assetsDir));

  await app.listen(process.env.PORT ?? 3003);
}

bootstrap();