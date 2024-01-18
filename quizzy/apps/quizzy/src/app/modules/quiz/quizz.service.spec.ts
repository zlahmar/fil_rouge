import { Test, TestingModule } from '@nestjs/testing';
import { QuizzService } from './quizz.service';

describe('QuizzService', () => {
  let service: QuizzService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizzService],
    }).compile();

    service = module.get<QuizzService>(QuizzService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
