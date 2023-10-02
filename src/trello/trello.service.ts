// src/trello/trello.service.ts

import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TrelloService {
  private readonly apiKey: string;
  private readonly apiToken: string;
  private readonly boardId: string;

  constructor(private readonly configService: ConfigService) {
    // Retrieve Trello API credentials from environment variables using ConfigService.
    this.apiKey = this.configService.get<string>('TRELLO_API_KEY');
    this.apiToken = this.configService.get<string>('TRELLO_API_TOKEN');
    this.boardId = 'GU6JzE3p'
  }

  async getTasksFromBoard(): Promise<any> {
    try {
      const response = await axios.get(
        `https://api.trello.com/1/boards/${this.boardId}/cards`,
        {
          params: {
            key: this.apiKey,
            token: this.apiToken,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw new Error('Error fetching tasks from Trello: ' + error.message);
    }
  }
}

