import { QuizQuestion } from './quiz-question';

export interface Quiz {
  id: string;
  title: string;

  questions: QuizQuestion[];

  _links?: {
    start?: string;
  }
}
