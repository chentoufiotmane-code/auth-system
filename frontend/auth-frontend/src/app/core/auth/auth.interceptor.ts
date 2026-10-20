import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  // Match absolute API URL or relative endpoint
  const isApiRequest =
    req.url.startsWith(environment.apiBaseUrl) ||
    req.url.startsWith('/api');

  if (!isApiRequest || !auth.isAuthenticated()) {
    return next(req);
  }

  return from(auth.getToken()).pipe(
    switchMap((token) => {
      if (!token) {
        return next(req);
      }

      const authenticatedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      return next(authenticatedRequest).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            console.warn('Access token rejected by server (401 Unauthorized). Resetting auth session.');
            void auth.logout();
          }
          return throwError(() => error);
        })
      );
    })
  );
};
