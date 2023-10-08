import { Test, TestingModule } from '@nestjs/testing';
import { TrelloService } from './trello.service';
import axios from 'axios';
import { TrelloEntity } from './trello.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

// Create a mock for the axios library
jest.mock('axios');

describe('TrelloService', () => {
  let trelloService: TrelloService;
  let axiosGetMock: jest.Mock;

  // Mock ConfigService
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

  // Mock Task Repository
  const mockTaskRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    clear: jest.fn(), // Mock the clear method
  };

  beforeEach(async () => {
    axiosGetMock = jest.fn();
    axios.get = axiosGetMock; // Assign the mock to axios.get

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

  describe('getTasks', () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Reset mock spies before each test
    });

    it('should fetch tasks from Trello and save them to the database', async () => {
      // Mock Axios response
      const mockTasks = [
        {
          id: '1',
          name: 'Task 1',
          due: null,
          desc: 'Description for Task 1',
        },
        {
          id: '2',
          name: 'Task 2',
          due: '2023-10-10',
          desc: null,
        },
      ];
      axiosGetMock.mockResolvedValue({ data: mockTasks });

      // Mock taskRepository.save method
      const saveMock = jest.fn();
      mockTaskRepository.save = saveMock;

      // Mock taskRepository.clear method
      const clearMock = jest.fn();
      mockTaskRepository.clear = clearMock;

      const boardId = 'OoAkCCdg';
      const response = await trelloService.getTasks<TrelloEntity[]>(boardId);

      // Check if the response is successful
      expect(response.success).toBe(true);
      expect(response.data).toEqual(mockTasks);

      // Check if taskRepository.clear was called
      expect(clearMock).toHaveBeenCalledTimes(1);

      // Check if taskRepository.save was called for each task
      expect(saveMock).toHaveBeenCalledTimes(mockTasks.length);

      // Verify the saved tasks
      expect(saveMock).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Task 1',
          cardId: '1',
          dueDate: null,
          description: 'Description for Task 1',
        }),
      );
      expect(saveMock).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Task 2',
          cardId: '2',
          dueDate: '2023-10-10',
          description: null,
        }),
      );
    });

    it('should handle errors when fetching tasks from Trello', async () => {
      // Mock Axios error
      const errorMessage = 'Error fetching tasks from Trello';
      axiosGetMock.mockRejectedValue(new Error(errorMessage));

      const boardId = 'OoAkCCdg';
      const response = await trelloService.getTasks<TrelloEntity[]>(boardId);

      // Check if the response is not successful
      expect(response.success).toBe(false);
      expect(response.error).toEqual(`Error fetching tasks from Trello: ${errorMessage}`);
      expect(response.data).toBe(null);
    });
  });

  describe('createTask', () => {
    it('should create a new task with valid input', async () => {
      const name = 'New Task';
      const cardId = '3';
      const dueDate = '2023-11-01';
      const description = 'Description for New Task';

      // Create a sample task for assertion
      const sampleTask: TrelloEntity = {
        name,
        cardId,
        dueDate, // Keep dueDate as a string
        description,
      };
      // Mock taskRepository.save method
      const saveMock = jest.fn().mockResolvedValue(sampleTask);
      mockTaskRepository.save = saveMock;

      // Call the createTask method
      const createdTask = await trelloService.createTask(name, cardId, dueDate, description);

      // Check if taskRepository.save was called with the correct parameters
      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(saveMock).toHaveBeenCalledWith(sampleTask);

      // Check if the created task matches the returned task
      expect(createdTask).toEqual(sampleTask);
    });

    it('should create a task with null values for undefined input', async () => {
      const name = 'Task with Null Values';
      const cardId = '4';

      const sampleTask = {
        name: name,
        cardId: cardId,
        dueDate: null,
        description: null,
      }
    
      // Mock taskRepository.save method to return a resolved value
      const saveMock = jest.fn().mockResolvedValue(sampleTask);
      mockTaskRepository.save = saveMock;
    
      // Call the createTask method with undefined dueDate and description
      const createdTask = await trelloService.createTask(name, cardId, undefined, undefined);
    
      // Check if taskRepository.save was called with null values for dueDate and description
      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(saveMock).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Task with Null Values',
          cardId: '4',
          dueDate: null,
          description: null,
        })
      );
    
      // Check if the created task matches the returned task with null values
      expect(createdTask).toEqual(
        expect.objectContaining({
          name: 'Task with Null Values',
          cardId: '4',
          dueDate: null,
          description: null,
        })
      );
    });
    

    it('should handle errors when saving a task', async () => {
      const name = 'Task with Error';
      const cardId = '5';
      const errorMessage = 'Error saving task';

      // Mock taskRepository.save method to throw an error
      mockTaskRepository.save.mockRejectedValue(new Error(errorMessage));

      // Call the createTask method
      await expect(trelloService.createTask(name, cardId, undefined, undefined)).rejects.toThrow(errorMessage);
    });
  });
  describe('getAllTasks', () => {
    it('should return an array of tasks', async () => {
      // Create an array of sample tasks to be returned by the mock taskRepository
      const sampleTasks = [
        {
          name: 'Task 1',
          cardId: '1',
          dueDate: '2023-10-10',
          description: 'Description for Task 1',
        },
        {
          name: 'Task 2',
          cardId: '2',
          dueDate: null,
          description: 'Description for Task 2',
        },
      ];
  
      // Mock taskRepository.find method to return the sample tasks
      const findMock = jest.fn().mockResolvedValue(sampleTasks);
      mockTaskRepository.find = findMock;
  
      // Call the getAllTasks method
      const tasks = await trelloService.getAllTasks();
  
      // Check if taskRepository.find was called
      expect(findMock).toHaveBeenCalledTimes(1);
  
      // Check if the returned tasks match the sample tasks
      expect(tasks).toEqual(sampleTasks);
    });
  
    it('should handle errors when fetching tasks', async () => {
      // Mock taskRepository.find method to throw an error
      const errorMessage = 'Error fetching tasks';
      mockTaskRepository.find = jest.fn().mockRejectedValue(new Error(errorMessage));
  
      // Call the getAllTasks method
      try {
        await trelloService.getAllTasks();
        // If it doesn't throw an error, the test should fail
        expect(true).toBe(false);
      } catch (error) {
        // Check if the error message matches
        expect(error.message).toBe(errorMessage);
      }
    });
  });
  
});
