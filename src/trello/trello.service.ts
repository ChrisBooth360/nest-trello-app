import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config'; // Import ConfigService

@Injectable()
export class TrelloService {
  private readonly apiKey: string;
  private readonly apiToken: string;

  constructor(private readonly configService: ConfigService) {
    // Retrieve Trello API credentials from environment variables using ConfigService.
    this.apiKey = this.configService.get<string>('TRELLO_API_KEY');
    this.apiToken = this.configService.get<string>('TRELLO_API_TOKEN');
  }

  async getBoardTasks(boardId: string) {
    const url = `https://api.trello.com/1/boards/${boardId}/cards?key=${this.apiKey}&token=${this.apiToken}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error('Unable to fetch board tasks from Trello API');
    }
  }
}
