import { Test, TestingModule } from '@nestjs/testing';
import { QuizService } from './quiz.service';
import { FirebaseAdmin, FirebaseConstants } from 'nestjs-firebase';

const mockFirebaseAdmin = {
  firestore: {
    doc: jest.fn(),
    collection: jest.fn(),
  },
}
describe('QuizService', () => {
  let service: QuizService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuizService,
        {
          provide: FirebaseConstants.FIREBASE_TOKEN,
          useValue: mockFirebaseAdmin, 
        },
      ],
    }).compile();

    service = module.get<QuizService>(QuizService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
