
import { Component, inject } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="navbar">
      <a routerLink="/" class="brand">
        <span class="brand-icon">A</span>
        AuthPlatform
      </a>

      <nav>
        <a routerLink="/" routerLinkActive="active"
           [routerLinkActiveOptions]="{ exact: true }">
          Home
        </a>

        @if (auth.isAuthenticated()) {
          <a routerLink="/dashboard" routerLinkActive="active">
            Dashboard
          </a>

          <a routerLink="/profile" routerLinkActive="active">
            Profile
          </a>
        }
      </nav>
      <div class="account">
        @if (auth.isAuthenticated()) {
          <span class="username">
            {{ auth.getUsername() }}
          </span>
          <button (click)="auth.logout()">Logout</button>
        } @else {
          <button class="register-btn" (click)="auth.register()">
            Register
          </button>
          <button (click)="auth.login()">Login</button>
        }
      </div>
    </header>

    <main>
      <router-outlet />
    </main>

    <footer>
      Angular · Keycloak · Spring Boot
    </footer>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      color: #0f172a;
      font-family: Arial, sans-serif;
    }

    .navbar {
      min-height: 72px;
      padding: 0 5%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      border-bottom: 1px solid #e2e8f0;
      background: white;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #0f172a;
      font-weight: 800;
      text-decoration: none;
      white-space: nowrap;
    }

    .brand-icon {
      display: grid;
      place-items: center;
      width: 34px;
      height: 34px;
      border-radius: 10px;
      color: white;
      background: #4f46e5;
    }

    nav, .account {
      display: flex;
      align-items: center;
      gap: 18px;
    }

    nav a {
      color: #64748b;
      text-decoration: none;
      font-size: 14px;
    }

    nav a.active {
      color: #4f46e5;
      font-weight: 700;
    }

    button {
      border: 0;
      border-radius: 8px;
      padding: 10px 16px;
      background: #4f46e5;
      color: white;
      font-weight: 600;
      cursor: pointer;
    }

    .register-btn {
      background: white;
      color: #4f46e5;
      border: 1px solid #c7d2fe;
    }

    .register-btn:hover {
      background: #eef2ff;
    }

    .username {
      font-size: 13px;
      color: #475569;
    }

    footer {
      padding: 24px;
      text-align: center;
      color: #94a3b8;
      font-size: 12px;
      border-top: 1px solid #e2e8f0;
    }

    @media (max-width: 700px) {
      .navbar {
        flex-wrap: wrap;
        padding: 16px;
      }

      nav {
        order: 3;
        width: 100%;
        justify-content: center;
      }

      .username {
        display: none;
      }
    }
  `],
})
export class AppComponent {
  readonly auth = inject(AuthService);
}

