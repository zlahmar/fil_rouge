import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { FirebaseConstants } from 'nestjs-firebase';

@Module({
  controllers: [QuizController],
  providers: [QuizService],
  imports: [FirebaseConstants],
})
export class QuizModule {}
