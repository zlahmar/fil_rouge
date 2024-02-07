interface QuizQuestionAnswer {
  title: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  title: string;
  answers: QuizQuestionAnswer[];
}

export interface QuizQuestionToCreate {
  title: string;
  answers: QuizQuestionAnswer[];
}
