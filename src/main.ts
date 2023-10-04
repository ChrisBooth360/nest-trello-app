// src/main.ts

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets('public'); // Serve static files from the 'public' directory

  // Configure CORS here
  app.enableCors({
    origin: 'http://localhost:3000', // Add where the frontend is hosted
    credentials: true,
  });

  await app.listen(3000);
}

bootstrap();
