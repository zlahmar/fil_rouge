import { Route } from '@angular/router';
import { QuizEditPageComponent } from './quiz-edit-page.component';

export const quizEditRoutes: Route[] = [{
  path: ':id',
  component: QuizEditPageComponent
}];
