import { Route } from '@angular/router';
import { WelcomePageComponent } from './pages/welcome/welcome-page.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: WelcomePageComponent
  },
  {
    path: 'quiz',
    loadChildren: () => import('./pages/quiz-edit/quiz-edit.routes').then(m => m.quizEditRoutes)
  },
  {
    path: 'host',
    loadChildren: () => import('./pages/host-quiz/host-quiz.routes').then(m => m.hostQuizRoutes)
  },
  {
    path: 'join',
    loadChildren: () => import('./pages/join-quiz/join-quiz.routes').then(m => m.joinQuizRoutes)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.routes').then(m => m.loginRoutes)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.routes').then(m => m.registerRoutes)
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: ''
  }
];
