
import { Component } from '@angular/core';
import { keycloak } from '../../core/auth/keycloak.config';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  get username(): string {
    return keycloak.tokenParsed?.['preferred_username'] as string ?? 'Unknown';
  }

  get email(): string {
    return keycloak.tokenParsed?.['email'] as string ?? 'Not provided';
  }

  get fullName(): string {
    return keycloak.tokenParsed?.['name'] as string ?? this.username;
  }

  get subject(): string {
    return keycloak.tokenParsed?.['sub'] as string ?? 'Unavailable';
  }
}
