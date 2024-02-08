import { Test, TestingModule } from '@nestjs/testing';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { RequestWithUser } from '../auth/model/request-with-user';
import { Response } from 'express';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Quiz } from './model/quiz';
import { FirebaseConstants } from 'nestjs-firebase';
import { CreateQuizDTO } from './model/QuizDTO';

describe('QuizController', () => {
  let controller: QuizController;
  let app: INestApplication;

  const mockUserService = {
    // Mock your QuizService methods here
    create: jest.fn(),
    selectAll: jest.fn(),
    selectOne: jest.fn(),
    updateQuiz: jest.fn(),
    createQuestion: jest.fn(),
    updateQuestion: jest.fn(),
  };

  const mockRequestWithUser: RequestWithUser = {
    user: {
      uid: 'mockUid',
      email: 'test@example.com',
    },
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizController],
      imports: [FirebaseConstants],
      providers: [
        {
          provide: QuizService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<QuizController>(QuizController);
  });

  it('should create a new quiz', async () => {
 
    const createdQuizId = 'mockQuizId';
    mockUserService.create.mockReturnValueOnce(createdQuizId);

    const newQuiz: Quiz = {
      id: 'mockId',
      title: 'Mock Quiz',
      description: 'Mock Quiz Description',
      questions: [
        {
          id: 'mockQuestionId',
          title: 'Mock Question',
          answers: [
            { title: 'Mock Answer 1', isCorrect: true },
            { title: 'Mock Answer 2', isCorrect: false },
          ],
          isStartable: () => true,
        },
      ],
      _links: undefined,
      executionId: '',
      isStartable: function (): boolean {
        throw new Error('Function not implemented.');
      }
    };

    const request = {user: {uid: "123"}};
    const responseObject = {
      set: (data) => {
        return {json: () => {}}
      },
      
    }
    const response = await controller.createQuizz(responseObject as unknown as Response ,request as RequestWithUser, newQuiz as unknown as CreateQuizDTO);
    expect(response).toBeDefined();
  });


});
