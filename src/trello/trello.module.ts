// src/trello/trello.module.ts

import { Module } from '@nestjs/common';
import { TrelloController } from './trello.controller';
import { TrelloService } from './trello.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrelloEntity } from './trello.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrelloEntity]), // Import and provide TrelloEntityRepository
  ],
  controllers: [TrelloController],
  providers: [TrelloService],
})
export class TrelloModule {}
