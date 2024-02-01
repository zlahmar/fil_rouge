import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { AuthMiddleware } from '../auth/auth.middleware';

@Module({
  controllers: [QuizController],
  providers: [QuizService]
})
export class QuizModule {}
