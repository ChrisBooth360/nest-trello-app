// src/main.ts

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as ejs from 'ejs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Set EJS as the view engine
  app.engine('ejs', ejs.renderFile);
  app.setViewEngine('ejs');

  await app.listen(3000);
}

bootstrap();
