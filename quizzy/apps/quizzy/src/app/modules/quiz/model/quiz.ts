export class Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];

  constructor(id: string, title: string) {
      this.id = id;
      this.title = title;
  }
}
export class Question {
  id: string;
  title: string;
  answers: Answer[];

  constructor(id: string, title: string, answers: Answer[]) {
    this.id = id;
    this.title = title;
    this.answers = answers;
  }
}
export class Answer {
  title: string;
  isCorrect: boolean;
}