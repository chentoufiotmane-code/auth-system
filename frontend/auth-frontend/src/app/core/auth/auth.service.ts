import { computed, Injectable, signal } from '@angular/core';
import Keycloak from 'keycloak-js';
import { keycloakConfig } from './keycloak.config';

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  fullName?: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly keycloak = new Keycloak(keycloakConfig);

  // Reactive state using Angular Signals
  readonly isAuthenticated = signal<boolean>(false);
  readonly userProfile = signal<UserProfile | null>(null);

  readonly username = computed(() => this.userProfile()?.username ?? '');
  readonly fullName = computed(() => this.userProfile()?.fullName ?? '');
  readonly email = computed(() => this.userProfile()?.email ?? '');
  readonly subject = computed(() => this.userProfile()?.id ?? '');
  readonly roles = computed(() => this.userProfile()?.roles ?? []);

  // Mutex lock to prevent duplicate concurrent refresh requests
  private refreshPromise: Promise<boolean> | null = null;

  async init(): Promise<boolean> {
    try {
      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
        pkceMethod: 'S256',
        checkLoginIframe: false,
      });

      this.isAuthenticated.set(authenticated);

      if (authenticated) {
        this.updateProfile();
      }

      this.setupEventHandlers();
      return authenticated;
    } catch (error) {
      console.error('Failed to initialize Keycloak SSO:', error);
      this.isAuthenticated.set(false);
      this.userProfile.set(null);
      return false;
    }
  }
  register(targetUrl?: string): Promise<void> {
    const redirectUri = targetUrl
      ? `${window.location.origin}${targetUrl}`
      : window.location.href;

    return this.keycloak.register({ redirectUri });
  }

  login(targetUrl?: string): Promise<void> {
    const redirectUri = targetUrl
      ? `${window.location.origin}${targetUrl}`
      : window.location.href;

    return this.keycloak.login({ redirectUri });
  }

  logout(redirectUrl?: string): Promise<void> {
    this.isAuthenticated.set(false);
    this.userProfile.set(null);

    return this.keycloak.logout({
      redirectUri: redirectUrl ?? window.location.origin,
    });
  }

  async getToken(): Promise<string | undefined> {
    if (!this.isAuthenticated()) {
      return undefined;
    }

    if (!this.refreshPromise) {
      this.refreshPromise = this.keycloak
        .updateToken(30)
        .finally(() => {
          this.refreshPromise = null;
        });
    }

    try {
      await this.refreshPromise;
      return this.keycloak.token;
    } catch (error) {
      console.warn('Session expired or token refresh failed:', error);
      this.isAuthenticated.set(false);
      this.userProfile.set(null);
      return undefined;
    }
  }

  getAccessToken(): string | undefined {
    return this.keycloak.token;
  }

  getUsername(): string | undefined {
    return this.username() || undefined;
  }

  hasRole(role: string): boolean {
    if (!this.isAuthenticated()) {
      return false;
    }

    return (
      this.keycloak.hasRealmRole(role) ||
      this.keycloak.hasResourceRole(role)
    );
  }

  hasAnyRole(roles: string[]): boolean {
    if (!roles.length) {
      return true;
    }
    return roles.some((role) => this.hasRole(role));
  }

  private updateProfile(): void {
    const parsed = this.keycloak.tokenParsed;
    if (!parsed) {
      this.userProfile.set(null);
      return;
    }

    const realmRoles = parsed.realm_access?.roles ?? [];
    const clientRoles = Object.values(parsed.resource_access ?? {}).flatMap(
      (res: { roles?: string[] }) => res.roles ?? []
    );

    const preferredUsername = (parsed['preferred_username'] as string) ?? '';
    const fullName = (parsed['name'] as string) ?? preferredUsername;
    const email = parsed['email'] as string | undefined;
    const sub = (parsed['sub'] as string) ?? '';

    this.userProfile.set({
      id: sub,
      username: preferredUsername,
      email,
      fullName,
      roles: Array.from(new Set([...realmRoles, ...clientRoles])),
    });
  }

  private setupEventHandlers(): void {
    this.keycloak.onAuthLogout = () => {
      this.isAuthenticated.set(false);
      this.userProfile.set(null);
    };

    this.keycloak.onTokenExpired = () => {
      void this.getToken();
    };

    this.keycloak.onAuthRefreshSuccess = () => {
      this.updateProfile();
    };
  }
}
