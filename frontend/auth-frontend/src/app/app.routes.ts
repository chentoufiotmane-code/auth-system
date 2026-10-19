import { Routes } from '@angular/router';
import {HomeComponent} from './features/home/home.component';
import {DashboardComponent} from './features/dashboard/dashboard.component';
import {ProfileComponent} from './features/profile/profile.component';
import {authGuard} from './core/auth/auth.guard';
import {roleGuard} from './core/auth/role.guard';
import {AdminComponent} from './features/admin/admin.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [roleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: '**',
    redirectTo: '',
  },

];
