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
  due: string | null;
  dueComplete: boolean | null;
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
    
  }

  async getBoardTasks<T>(boardId: string): Promise<TrelloResponse<T>> {
    try {
      const taskResponse = await axios.get<TrelloBoardData[]>(
        `https://api.trello.com/1/boards/${boardId}/cards`,
        {
          params: {
            key: this.apiKey,
            token: this.apiToken,
          },
        }
      );
  
      const tasksFromTrello = taskResponse.data as TrelloBoardData[];
  
      // Iterate through the fetched tasks and save them to the database
      for (const taskData of tasksFromTrello) {
        const { name, id, due, dueComplete } = taskData;
      
        // Convert null values to undefined to avoid issues with type mismatches
        await this.createTask(name, id, due || undefined, dueComplete || undefined);
      }
      
  
      const trelloResponse: TrelloResponse<T> = {
        data: tasksFromTrello as T,
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

  async createTask(name: string, cardId: string, dueDate: string | undefined, completed: boolean | undefined): Promise<TrelloEntity> {
    try {
      const task = new TrelloEntity();
      task.name = name;
      task.cardId = cardId;
      task.dueDate = dueDate; // Assign 'dueDate' instead of 'due'
      task.completed = completed; // Assign 'completed' instead of 'dueComplete'
  
      const savedTask = await this.taskRepository.save(task);
      console.log('Task saved:', savedTask);
      return savedTask;
    } catch (error) {
      console.error('Error saving task:', error);
      throw error;
    }  
  }
  
  

  async getAllTasks(): Promise<TrelloEntity[]> {
    return await this.taskRepository.find();
  }
}
