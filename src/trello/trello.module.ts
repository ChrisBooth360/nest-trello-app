// src/trello/trello.module.ts

import { Module } from '@nestjs/common';
import { TrelloController } from './trello.controller';
import { TrelloService } from './trello.service';

@Module({
  controllers: [TrelloController],
  providers: [TrelloService],
})
export class TrelloModule {}
