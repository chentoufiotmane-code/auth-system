import {ApplicationConfig, provideAppInitializer, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { withInterceptors, provideHttpClient} from '@angular/common/http';
import { keycloak } from './core/auth/keycloak.config';

import { authInterceptor } from './core/auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({
      eventCoalescing: true
    }),
    provideRouter(routes),
    provideHttpClient( withInterceptors([authInterceptor])
    ),

    provideAppInitializer(() => {
      const init = () =>
        keycloak.init({
          onLoad: 'check-sso',
          pkceMethod: 'S256',
          checkLoginIframe: false,
        });
      return init();
    }),
  ]
};
