
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { keycloak } from './keycloak.config';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const requiredRoles: string[] = route.data['roles'] ?? [];

  if (!keycloak.authenticated) {
    void keycloak.login({
      redirectUri: window.location.origin + state.url
    });

    return false;
  }

  const token = keycloak.tokenParsed as {
    realm_access?: { roles?: string[] };
  } | undefined;

  const userRoles = token?.realm_access?.roles ?? [];

  const hasRequiredRole = requiredRoles.some(
    role => userRoles.includes(role)
  );

  return hasRequiredRole ? true : router.parseUrl('/');
};
