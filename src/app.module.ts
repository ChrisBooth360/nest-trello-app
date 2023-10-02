// src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TrelloModule } from './trello/trello.module'; // Import the TrelloModule

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}), // Configure ConfigModule
    TrelloModule,
  ]
})
export class AppModule {}

