import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './core/service/auth-guard.service';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./account/login/login.component').then(a => a.LoginComponent) },
  {
    path: '', component: DashboardComponent, canActivate: [authGuard], children: [
      { path: 'home', loadComponent: () => import('./pages/home/home.component').then(a => a.HomeComponent) },
      { path: 'user', loadComponent: () => import('./pages/user/user.component').then(a => a.UserComponent) },
      { path: 'addUser', loadComponent: () => import('./pages/user/add-user/add-user.component').then(a => a.AddUserComponent) },
      { path: 'editUser', loadComponent: () => import('./pages/user/add-user/add-user.component').then(a => a.AddUserComponent) }
    ]
  },
  { path: '**', loadComponent: () => import('./account/pagenotfound/pagenotfound.component').then(a => a.PagenotfoundComponent) }
];
