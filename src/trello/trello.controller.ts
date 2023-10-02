// src/trello/trello.controller.ts

import { Controller, Get, Post, Body } from '@nestjs/common';
import { TrelloService } from './trello.service';
import { TrelloEntity } from './trello.entity';

@Controller('trello')
export class TrelloController {
  constructor(private readonly trelloService: TrelloService) {}

  @Get('tasks')
  async getBoardTasks(): Promise<any> {
    const tasks = await this.trelloService.getBoardTasks("GU6JzE3p");
    return tasks;
  }

  @Post('tasks')
  async createTask(@Body() taskData: { name: string }): Promise<TrelloEntity> {
    const { name } = taskData;
    return await this.trelloService.createTask(name);
  }

  @Get('saved-tasks')
  async getSavedTasks(): Promise<TrelloEntity[]> {
    return await this.trelloService.getAllTasks();
  }
}
