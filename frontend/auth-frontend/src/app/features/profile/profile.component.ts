import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  private readonly auth = inject(AuthService);

  get username(): string {
    return this.auth.username() || 'Unknown';
  }

  get email(): string {
    return this.auth.email() || 'Not provided';
  }

  get fullName(): string {
    return this.auth.fullName() || this.username;
  }

  get subject(): string {
    return this.auth.subject() || 'Unavailable';
  }
}
