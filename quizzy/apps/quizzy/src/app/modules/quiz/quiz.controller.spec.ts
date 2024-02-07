import { Test, TestingModule } from '@nestjs/testing';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { RequestWithUser } from '../auth/model/request-with-user';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Quiz } from './model/quiz';
import { QuizModule } from './quiz.module';
import { UserDetails } from '../auth/model/user-details';

import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import {FakeAuthMiddleware} from "../auth/fakeAuth.middleware";

/*@Injectable()
export class FakeAuthMiddleware implements NestMiddleware {
  static currentUser: UserDetails | null = null;

  static SetUser(uid: string) {
    if (!uid) {
      FakeAuthMiddleware.currentUser = null;
      return;
    }
    FakeAuthMiddleware.currentUser = {
      uid,
      email: `${uid}@mail.com`,
    };
  }

  static Reset() {
    FakeAuthMiddleware.currentUser = null;
  }

  public async use(req: any, _: Response, next: NextFunction) {
    req.user = FakeAuthMiddleware.currentUser;
    next();
  }
}*/

describe('QuizController', () => {
  let controller: QuizController;
  let app: INestApplication;

  const mockUserService = {
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
      imports: [QuizModule],
    })
      .overrideProvider(QuizService)
      .useValue(mockUserService)
      .compile();

    app = module.createNestApplication();
    app.use(new FakeAuthMiddleware().use);
    await app.init();
    controller = module.get<QuizController>(QuizController);
  });

  afterEach(async () => {
    await app.close();
  });

  it('should create a new quiz', async () => {
    const createdQuizId = 'mockQuizId';
    mockUserService.create.mockReturnValueOnce(createdQuizId);
    FakeAuthMiddleware.SetUser('mockUid');

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
        },
      ],
      _links: undefined
    };

    const response = await request(app.getHttpServer())
      .post('/quiz')
      .set('Authorization', 'Bearer mockToken')
      .send(newQuiz);

    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.header['location']).toEqual(`http://localhost:3000/api/quiz/${createdQuizId}`);
  });

  it('should get all quizzes', async () => {
    const mockQuizzes = [{ id: '1', title: 'Quiz 1' }, { id: '2', title: 'Quiz 2' }];
    mockUserService.selectAll.mockReturnValueOnce(mockQuizzes);
    FakeAuthMiddleware.SetUser('mockUid');

    const response = await request(app.getHttpServer())
      .get('/quiz')
      .set('Authorization', 'Bearer mockToken');

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual(mockQuizzes);
  });

  it('should get a quiz by ID', async () => {
    const mockQuiz = { id: '1', title: 'Quiz 1' };
    mockUserService.selectOne.mockReturnValueOnce(mockQuiz);
    FakeAuthMiddleware.SetUser('mockUid');

    const response = await request(app.getHttpServer())
      .get('/quiz/1')
      .set('Authorization', 'Bearer mockToken');

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual(mockQuiz);
  });

  // Add more tests for other QuizController methods

  // ... (partie de configuration et de beforeEach inchangée)

it('should create a new question for a quiz', async () => {
  const quizId = 'mockQuizId';
  const createdQuestionId = 'mockQuestionId';
  mockUserService.createQuestion.mockReturnValueOnce(createdQuestionId);
  FakeAuthMiddleware.SetUser('mockUid');

  const newQuestion = {
    title: 'Mock Question',
    answers: [
      { title: 'Mock Answer 1', isCorrect: true },
      { title: 'Mock Answer 2', isCorrect: false },
    ],
  };

  const response = await request(app.getHttpServer())
    .post(`/quiz/${quizId}/questions`)
    .set('Authorization', 'Bearer mockToken')
    .send(newQuestion);

  expect(response.status).toBe(HttpStatus.CREATED);
  expect(response.header['location']).toEqual(`http://localhost:3000/api/quiz/${quizId}`);
});

it('should update a question for a quiz', async () => {
  const quizId = 'mockQuizId';
  const questionId = 'mockQuestionId';
  mockUserService.updateQuestion.mockReturnValueOnce(true);
  FakeAuthMiddleware.SetUser('mockUid');

  const updatedQuestion = {
    title: 'Updated Mock Question',
    answers: [
      { title: 'Updated Mock Answer 1', isCorrect: true },
      { title: 'Updated Mock Answer 2', isCorrect: false },
    ],
  };

  const response = await request(app.getHttpServer())
    .put(`/quiz/${quizId}/questions/${questionId}`)
    .set('Authorization', 'Bearer mockToken')
    .send(updatedQuestion);

  expect(response.status).toBe(HttpStatus.NO_CONTENT);
});


}); 
