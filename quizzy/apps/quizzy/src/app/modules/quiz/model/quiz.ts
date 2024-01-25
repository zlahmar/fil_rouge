export class Quiz {
    id: string;
    title: string;
    description: string;
    questions: Question[];
  }
  class Question {
    title: string;
    answers: Answer[];
  }
  class Answer {
    title: string;
    isCorrect: boolean;
  }