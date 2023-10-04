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

  describe('createTask', () => {
    it('should create a task', async () => {
      // Arrange
      const name = 'Test Task';
      const cardId = '12345';
      const dueDate = '2023-12-31';
      const description = 'Test description';

      const newTask = new TrelloEntity();
      newTask.name = name;
      newTask.cardId = cardId;
      newTask.dueDate = dueDate;
      newTask.description = description;

      const mockSavedTask = { ...newTask };

      mockTaskRepository.findOne.mockResolvedValueOnce(undefined);
      mockTaskRepository.save.mockResolvedValueOnce(mockSavedTask);

      // Act
      const result = await trelloService.createTask(name, cardId, dueDate, description);

      // Assert
      expect(mockTaskRepository.findOne).toHaveBeenCalledWith({ where: { cardId } });
      expect(mockTaskRepository.save).toHaveBeenCalledWith(newTask);
      expect(result).toEqual(mockSavedTask);
    });

    it('should update an existing task', async () => {
      // Arrange
      const name = 'Updated Task Name';
      const cardId = '12345';
      const dueDate = '2023-11-31';
      const description = 'Updated Task Description';

      const existingTask = new TrelloEntity();
      existingTask.name = 'Original Task Name';
      existingTask.cardId = cardId;

      mockTaskRepository.findOne.mockResolvedValueOnce(existingTask);

      const updatedTask = { ...existingTask };
      updatedTask.name = name;
      updatedTask.dueDate = dueDate;
      updatedTask.description = description;

      mockTaskRepository.save.mockResolvedValueOnce(updatedTask);

      // Act
      const result = await trelloService.createTask(name, cardId, dueDate, description);

      // Assert
      expect(mockTaskRepository.findOne).toHaveBeenCalledWith({ where: { cardId } });
      expect(mockTaskRepository.save).toHaveBeenCalledWith(updatedTask);
      expect(result).toEqual(updatedTask);
    });

    it('should handle errors', async () => {
      // Arrange
      const name = 'Test Task';
      const cardId = 'test-card-id';
      const dueDate = '2023-12-31';
      const description = 'Test description';

      mockTaskRepository.findOne.mockRejectedValueOnce(new Error('Database error'));

      // Act & Assert
      await expect(
        trelloService.createTask(name, cardId, dueDate, description)
      ).rejects.toThrowError('Database error');
    });
  });

});
