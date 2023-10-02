// src/trello/trello.service.ts

import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrelloEntity } from './trello.entity';

// Define the TrelloBoardData interface
interface TrelloBoardData {
  id: string;
  name: string;
  // Add more properties as needed
}

// Define the TrelloResponse type
type TrelloResponse<T> = {
  data: T;
  success: boolean;
  error?: string;
};

@Injectable()
export class TrelloService {
  private readonly apiKey: string;
  private readonly apiToken: string;
  private readonly boardId: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(TrelloEntity)
    private readonly taskRepository: Repository<TrelloEntity>,
  ) {
    // Retrieve Trello API credentials from environment variables using ConfigService.
    this.apiKey = this.configService.get<string>('TRELLO_API_KEY');
    this.apiToken = this.configService.get<string>('TRELLO_API_TOKEN');
    this.boardId = this.configService.get<string>('BOARD_ID');
  }

  async getBoardTasks<T>(boardId: string): Promise<TrelloResponse<T>> {
    try {
      const response = await axios.get<TrelloBoardData[]>(
        `https://api.trello.com/1/boards/${boardId}/cards`,
        {
          params: {
            key: this.apiKey,
            token: this.apiToken,
          },
        }
      );

      const trelloResponse: TrelloResponse<T> = {
        data: response.data as T,
        success: true,
      };

      return trelloResponse;
    } catch (error) {
      const trelloResponse: TrelloResponse<T> = {
        data: null,
        success: false,
        error: 'Error fetching tasks from Trello: ' + error.message,
      };
      return trelloResponse;
    }
  }

  async createTask(name: string): Promise<TrelloEntity> {
    const task = new TrelloEntity();
    task.name = name;
    return await this.taskRepository.save(task);
  }

  async getAllTasks(): Promise<TrelloEntity[]> {
    return await this.taskRepository.find();
  }
}
