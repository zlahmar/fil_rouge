import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserDetails } from './user-details';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly httpClient = inject(HttpClient);

  getUser(): Observable<UserDetails | null> {
    return this.httpClient.get<UserDetails>(`${environment.apiUrl}/users/me`).pipe(
      catchError(() => of(null))
    );
  }
}
