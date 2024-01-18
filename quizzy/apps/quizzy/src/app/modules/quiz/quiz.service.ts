import { Injectable } from '@nestjs/common';

@Injectable()
export class QuizService {
  createQuiz(quizData: any): string {
    // Logique de création du questionnaire
    return 'Quiz créé avec succès!';
  }

  createUser(userData: any): string {
    // Logique de création de l'utilisateur
    return 'Utilisateur créé avec succès!';
  }
}
