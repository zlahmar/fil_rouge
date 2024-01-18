import { Controller, Post, Body } from '@nestjs/common';
import { QuizService } from './quiz.service';

@Controller('api/quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post('create')
  createQuiz(@Body() quizData: any): string {
    return this.quizService.createQuiz(quizData);
  }

  @Post('user/create')
  createUser(@Body() userData: any): string {
    return this.quizService.createUser(userData);
  }
}
