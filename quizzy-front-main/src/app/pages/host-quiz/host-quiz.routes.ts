import { Route } from '@angular/router';
import { HostQuizPageComponent } from './host-quiz-page.component';

export const hostQuizRoutes: Route[] = [{
  path: ':id',
  component: HostQuizPageComponent
}];
