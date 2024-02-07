import { inject, Injectable } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword, User } from '@angular/fire/auth';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';
import { UserDetails } from './user-details';
import { UserService } from './user.service';


export interface LoginResult {
  isSuccess: boolean;
  errors: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private userService = inject(UserService);

  user$: Observable<User | null> =  authState(this.auth);
  userDetails$: Observable<UserDetails | null> = this.user$.pipe(
    switchMap((user) => {
      if (!user) {
        return of(null);
      }
      return this.userService.getUser();
    })
  );
  isLogged$ = this.user$.pipe(map((user) => !!user));

  login(email: string, password: string): Observable<LoginResult> {
    return from(signInWithEmailAndPassword(this.auth, email, password))
      .pipe(map(value => ({ isSuccess: true, errors: [] })),
        catchError((error): Observable<LoginResult> => {
          if (error?.code === 'auth/invalid-credentials') {
            return of({ isSuccess: false, errors: ['Invalid credentials'] });
          }
          return of({ isSuccess: false, errors: [JSON.stringify(error)] });
        })
      );
  }

  async logout() {
    await this.auth.signOut();
  }
}
