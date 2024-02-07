import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';

export interface RegisterResult {
  isSuccess: boolean;
  errors: string[];
}

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private readonly httpClient = inject(HttpClient);
  private readonly authService = inject(Auth);

  register(username: string, email: string, password: string): Observable<RegisterResult> {
    return from(
      createUserWithEmailAndPassword(
        this.authService,
        email,
        password
      )
    ).pipe(
      catchError((err) => {
        return of({
          isSuccess: false,
          errors: ['The registration by firebase failed, with the following error : ' + JSON.stringify(err)]
        });
      }),
      switchMap((u) =>
        this.httpClient.post(`${environment.apiUrl}/users`, {
          username
        }).pipe(map(() => ({
            isSuccess: true,
            errors: []
          })),
          catchError((err) => {
              return of({
                isSuccess: false,
                errors: ['The registration by firebase succeeded, but the registration by the backend failed, with the following error : ' + JSON.stringify(err)]
              });
            }
          ))
      )
    );
  }
}
