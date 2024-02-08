export class Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  _links:any;
  executionId: string;

  constructor(id: string, title: string) {
      this.id = id;
      this.title = title;
  }
  public isStartable(): boolean {
    if(this.title && this.title.trim() !== '') {
      return true;
    }
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
  public isStartable(): boolean {
    if (this.title && this.title.trim() !== '' && this.answers && this.answers.length > 1) {
      var nbCorrectAnswer = 0;
      this.answers.forEach(answer => {
        if(answer.isCorrect) {
          nbCorrectAnswer++;
        }
        if(nbCorrectAnswer > 1) {
          return false;
        }
      });
      if(nbCorrectAnswer === 1) {
        return true;
      }
    }
    return false;
  }
}
export class Answer {
  title: string;
  isCorrect: boolean;
}