
import { Injectable } from '@angular/core';
import { keycloak } from './keycloak.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  login(): void {
    void keycloak.login({
      redirectUri: window.location.origin,
    });
  }

  logout(): void {
    void keycloak.logout({
      redirectUri: window.location.origin,
    });
  }

  isAuthenticated(): boolean {
    return keycloak.authenticated === true;
  }

  getUsername(): string | undefined {
    return keycloak.tokenParsed?.['preferred_username'] as
      | string
      | undefined;
  }

  getAccessToken(): string | undefined {
    return keycloak.token;
  }
}
