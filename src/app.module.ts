// src/app.module.ts

import { Module } from '@nestjs/common';
import { TrelloModule } from './trello/trello.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrelloEntity } from './trello/trello.entity'; // Import your entity
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TrelloModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [TrelloEntity],
      synchronize: true,
      logging: true,
    }),
  ]
})
export class AppModule {}

