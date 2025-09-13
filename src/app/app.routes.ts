import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/home/home').then(m => m.Home) },
  { path: 'login', loadComponent: () => import('./components/login/login').then(m => m.Login) },

  {
    path: 'dashboard',
    component: Dashboard,
    children: [
      { path: 'overview', loadComponent: () => import('./components/dashboard/pages/overview/overview').then(m => m.Overview) },
      { path: 'roles', loadComponent: () => import('./components/dashboard/pages/roles/roles').then(m => m.Roles) },
    ]
  },
];
