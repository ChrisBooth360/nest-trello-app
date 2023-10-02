// src/trello/trello.controller.ts

import { Controller, Get } from '@nestjs/common';
import { TrelloService } from './trello.service';

@Controller('trello')
export class TrelloController {
  constructor(private readonly trelloService: TrelloService) {}

  @Get('tasks')
  async getTasksFromBoard(): Promise<any> {
    const tasks = await this.trelloService.getTasksFromBoard();
    return tasks;
  }
}
