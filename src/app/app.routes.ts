import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';

export const routes: Routes = [
    {
    path: 'dashboard',
    component: Dashboard,
    children: [
         {path: 'overview',loadComponent: () => import('./components/dashboard/pages/overview/overview').then(m => m.Overview) },
      { path: 'roles', loadComponent: () => import('./components/dashboard/pages/roles/roles').then(m => m.Roles) },
    ]
  },
];
