// src/trello/trello.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { TrelloService } from './trello.service';

@Controller('trello')
export class TrelloController {
  constructor(private readonly trelloService: TrelloService) {}

  @Get(':boardId/tasks')
  async getTasksFromBoard(@Param('boardId') boardId: string) {
    try {
      const tasks = await this.trelloService.getBoardTasks(boardId);
      return tasks;
    } catch (error) {
      throw new Error('Unable to fetch tasks from Trello board');
    }
  }
}
