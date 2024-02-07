import { inject } from '@angular/core';
import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { from, Observable, switchMap, take } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  return authService.user$.pipe(
    take(1),
    switchMap((user) => {
      if (!user) {
        return next(request);
      }
      return from(user.getIdToken()).pipe(
        switchMap((token) => {
          if (token) {
            request = request.clone({
              setHeaders: { Authorization: `Bearer ${token}` },
            });
          }
          return next(request);
        })
      );
    })
  );
};
