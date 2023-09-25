import { Module } from '@nestjs/common';
import { TrelloService } from './trello.service';

@Module({
  providers: [TrelloService],
  exports: [TrelloService],
})
export class TrelloModule {}
