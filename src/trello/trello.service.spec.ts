import { Test, TestingModule } from '@nestjs/testing';
import { TrelloService } from './trello.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { TrelloEntity } from './trello.entity';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm'; // Import Repository

describe('TrelloService', () => {
  let service: TrelloService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:', // Use an in-memory database for testing
          entities: [TrelloEntity],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([TrelloEntity]),
      ],
      providers: [
        TrelloService,
        {
          provide: ConfigService,
          useValue: {
            get: () => 'your-config-values',
          },
        },
        {
          provide: getRepositoryToken(TrelloEntity), // Provide TrelloEntityRepository
          useClass: Repository, // Remove this line
        },
      ],
    }).compile();

    service = module.get<TrelloService>(TrelloService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Write your test cases here
  it('should create a task in the database', async () => {
    const taskData = { name: 'Test Task' };
    const createdTask = await service.createTask(taskData.name);

    expect(createdTask).toBeDefined();
    expect(createdTask.name).toBe(taskData.name);
  });
});
