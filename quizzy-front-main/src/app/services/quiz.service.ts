import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Quiz } from '../model/quiz';
import { TranslateService } from '@ngx-translate/core';
import { HateoasService, HateoasUrl } from './hateoas.service';
import { QuizQuestion, QuizQuestionToCreate } from '../model/quiz-question';

export interface QuizListResponse {
  status: 'OK' | 'ERROR';
  data: Quiz[];
  isCreateQuizLinkAvailable: boolean;
  _links? : {
    create?: string;
  }
}

export interface QuizResponse {
  status: 'OK' | 'NOT FOUND' | 'ERROR';
  data?: Quiz;
}

export interface GetAllQuizApiResponse {
  data: Quiz[];
  _links: {
    create: string;
  };
}


@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private readonly httpClient = inject(HttpClient);
  private readonly translateService = inject(TranslateService);
  private readonly hateoasService = inject(HateoasService);

  getAll(): Observable<QuizListResponse> {
    return this.httpClient.get<GetAllQuizApiResponse>(`${environment.apiUrl}/quiz`).pipe(
      tap(response => {
        if (response._links?.create) {
          this.hateoasService.addUrl(HateoasUrl.CreateQuiz, response._links.create);
        }
      }),
      map((response): QuizListResponse => ({ status: 'OK' , data: response.data, isCreateQuizLinkAvailable: !!response._links?.create })),
      catchError((): Observable<QuizListResponse> => of({ status: 'ERROR', data: [], isCreateQuizLinkAvailable: false })));
  }

  create() {
    const url = this.hateoasService.getUrl(HateoasUrl.CreateQuiz);
    return this.httpClient.post<void>(url || `${environment.apiUrl}/quiz`, {
      title: this.translateService.instant('quiz.defaultTitle'),
      description: this.translateService.instant('quiz.defaultDescription')
    }, {observe: 'response'}).pipe(tap((response) => {
      console.log(JSON.stringify(response.headers));
      if (response.headers.has('Location')) {
        this.hateoasService.addUrl(HateoasUrl.GetQuizAfterPost, response.headers.get('Location') || '');
      }
    }),
      map(response => {
        const location = response.headers.get('Location') || '';
        console.log('Location is', location);
        return location.substring(location.lastIndexOf('/') + 1);
      }));
  }

  get(id: string): Observable<QuizResponse> {
    return this.httpClient.get<Quiz>(`${environment.apiUrl}/quiz/${id}`).pipe(
      map((response): QuizResponse => ({ status: 'OK' , data: response })),
      catchError((err): Observable<QuizResponse> => {
        if(err.status === 404) {
          return of({ status: 'NOT FOUND', data: undefined });
        }
        return of({ status: 'ERROR', data: undefined });
      } ));
  }

  updateTitle(id: string, newTitle: string) {
    return this.httpClient.patch<void>(`${environment.apiUrl}/quiz/${id}`, [{ op: "replace", path: "/title", value: newTitle }]);
  }

  addQuestion(quizId: string): Observable<QuizQuestion> {
    const question: QuizQuestionToCreate = {title: this.translateService.instant('quiz.defaultQuestionTitle'), answers: []};
    return this.httpClient.post<void>(`${environment.apiUrl}/quiz/${quizId}/questions`, question, {observe: 'response'}).pipe(
      map(response => {
        const location = response.headers.get('Location') || '';
        return { id: location.substring(location.lastIndexOf('/') + 1), ...question}
      }));
  }

  updateQuestion(quizId: string, question: QuizQuestion) {
    return this.httpClient.put<void>(`${environment.apiUrl}/quiz/${quizId}/questions/${question.id}`, question);
  }

  start(url: string): Observable<string> {
    return this.httpClient.post<void>(url, {}, {observe: 'response'})
      .pipe(map(response => {
        const location = response.headers.get('Location') || '';
        return location.substring(location.lastIndexOf('/') + 1)
      }));
  }
}
