// trello.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { TrelloService } from './trello.service';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import axios from 'axios';
import { TrelloEntity } from './trello.entity';
import * as dotenv from 'dotenv';

dotenv.config();
jest.mock('axios');

describe('TrelloService', () => {
  let trelloService: TrelloService;
  let axiosGetMock: jest.Mock;

  const mockConfigService = {
    get: jest.fn((key) => {
      if (key === 'TRELLO_API_KEY') {
        return process.env.TRELLO_API_KEY;
      } else if (key === 'TRELLO_API_TOKEN') {
        return process.env.TRELLO_API_TOKEN;
      }
      return undefined; // Handle other config keys as needed
    }),
  };

  const mockTaskRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    axiosGetMock = jest.fn();
    (axios.get as jest.Mock) = axiosGetMock;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrelloService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: getRepositoryToken(TrelloEntity),
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    trelloService = module.get<TrelloService>(TrelloService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getBoardTasks', () => {
    it('should fetch board tasks from Trello', async () => {
      const boardId = 'sample-board-id';
      const responseData = [
        {
          id: 'task-id-1',
          name: 'Task 1',
          due: null,
          desc: null,
        },
        // Add more task data as needed
      ];

      axiosGetMock.mockResolvedValueOnce({ data: responseData });

      const result = await trelloService.getBoardTasks(boardId);

      expect(axiosGetMock).toHaveBeenCalledWith(
        `https://api.trello.com/1/boards/${boardId}/cards`,
        {
          params: {
            key: expect.any(String),
            token: expect.any(String),
          },
        }
      );

      expect(result.success).toBeTruthy();
      expect(result.data).toEqual(responseData);
    });

    it('should handle errors when fetching tasks from Trello', async () => {
      const boardId = 'sample-board-id';

      axiosGetMock.mockRejectedValueOnce(new Error('Network Error'));

      const result = await trelloService.getBoardTasks(boardId);

      expect(result.success).toBeFalsy();
      expect(result.error).toContain('Error fetching tasks from Trello');
    });
  });

  // Add more test cases for other methods as needed

});
