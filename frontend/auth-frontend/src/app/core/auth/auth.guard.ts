import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { keycloak } from './keycloak.config';

export const authGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router);

  if (keycloak.authenticated) {
    return true;
  }

  void keycloak.login({
    redirectUri: window.location.origin + state.url,
  });

  return false;
};
