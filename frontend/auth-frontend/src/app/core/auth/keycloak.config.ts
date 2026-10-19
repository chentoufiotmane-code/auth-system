
import Keycloak from 'keycloak-js';

export const keycloak = new Keycloak({
  url: 'http://localhost:8083',
  realm: 'auth-platform',
  clientId: 'angular-app',
});
