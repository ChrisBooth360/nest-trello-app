// src/trello/trello.controller.ts

import { Controller, Get, Post, Body, Param, Render, Res, Redirect, Req } from '@nestjs/common';
import { TrelloService } from './trello.service';
import { TrelloEntity } from './trello.entity';
import { Response, Request } from 'express';

@Controller('trello')
export class TrelloController {
  constructor(private readonly trelloService: TrelloService) { }

  @Get()
  @Render('task-form') // Render the 'form.ejs' template
  showForm() {
    return {};
  }

  @Post('submit')
  async submitForm(@Body() body: { boardUrl: string }, @Req() req: Request, @Res() res: Response) {
    const { boardUrl } = body;
    // Extract the boardId from the URL
    let parts = boardUrl.split('/');
    const boardId = parts[parts.length - 2]; // Updated boardId extraction
    console.log(boardId)
    // Manually create the redirect URL
    const redirectUrl = `/trello/${boardId}/tasks`;

    // Use res.redirect to perform the redirection
    res.redirect(redirectUrl);
  }

  @Get(':boardId/tasks')
  @Render('tasks') // Render the 'tasks.ejs' template
  async getBoardTasks(@Param('boardId') boardId: string, @Res() res: Response): Promise<{ tasks: TrelloEntity[] }> {
    const trelloResponse = await this.trelloService.getTasks<TrelloEntity[]>(boardId);

    if (trelloResponse.success) {
      const tasks = trelloResponse.data;
      return { tasks };
    } else {
      // Handle the error case here, e.g., by rendering an error page
      return { tasks: [] }; // Return an empty array if there's an error
    }
  }



  @Post('tasks')
  async createTask(@Body() taskData: { name: string, cardId: string, dueDate: string, description: string }): Promise<TrelloEntity> {
    const { name, cardId, dueDate, description } = taskData;
    return await this.trelloService.createTask(name, cardId, dueDate, description);
  }

  @Get('saved-tasks')
  @Render('tasks') // Render the 'tasks.ejs' template
  async getSavedTasks(@Res() res: Response): Promise<{ tasks: TrelloEntity[] }> {
    const tasks = await this.trelloService.getAllTasks();
    return { tasks };
  }
}
