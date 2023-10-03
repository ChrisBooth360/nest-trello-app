// src/trello/trello.controller.ts

import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TrelloService } from './trello.service';
import { TrelloEntity } from './trello.entity';

@Controller('trello')
export class TrelloController {
  constructor(private readonly trelloService: TrelloService) {}

  @Get(':boardId/tasks')
  async getBoardTasks(@Param('boardId') boardId: string): Promise<any> {
    const tasks = await this.trelloService.getBoardTasks(boardId);
    return tasks;
  }

  @Post('tasks')
  async createTask(@Body() taskData: { name: string, cardId: string, dueDate: string, description: string }): Promise<TrelloEntity> {
    const { name, cardId, dueDate, description } = taskData;
    return await this.trelloService.createTask(name, cardId, dueDate, description);
  }

  @Get('saved-tasks')
  async getSavedTasks(): Promise<TrelloEntity[]> {
    return await this.trelloService.getAllTasks();
  }
}
