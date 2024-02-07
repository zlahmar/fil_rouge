import { Route } from '@angular/router';
import { JoinQuizPageComponent } from './join-quiz-page.component';

export const joinQuizRoutes: Route[] = [{
  path: ':id',
  component: JoinQuizPageComponent
}];
