
import { HttpInterceptorFn } from '@angular/common/http';
import { from, switchMap } from 'rxjs';
import { keycloak } from './keycloak.config';

const API_URL = 'http://localhost:8080';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Never send the access token to unrelated URLs.
  if (!req.url.startsWith(API_URL)) {
    return next(req);
  }

  // Public API requests can proceed without a token.
  if (!keycloak.authenticated) {
    return next(req);
  }

  // Refresh the token if it is close to expiration.
  return from(keycloak.updateToken(30)).pipe(
    switchMap(() => {
      const token = keycloak.token;

      if (!token) {
        return next(req);
      }

      const authenticatedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      return next(authenticatedRequest);
    })
  );
};
