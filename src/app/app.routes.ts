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
      { path: 'compras', loadComponent: () => import('./components/dashboard/pages/compras/compras').then(m => m.Compras) },
      { path: 'ventas', loadComponent: () => import('./components/dashboard/pages/ventas/ventas').then(m => m.Ventas) },
      { path: 'roles', loadComponent: () => import('./components/dashboard/pages/roles/roles').then(m => m.Roles) },
      { path: 'tipos-identificaciones', loadComponent: () => import('./components/dashboard/pages/tipos-identificaciones/tipos-identificaciones').then(m => m.TiposIdentificaciones) },
      { path: 'perfiles', loadComponent: () => import('./components/dashboard/pages/perfiles/perfiles').then(m => m.Perfiles) },
      { path: 'categorias', loadComponent: () => import('./components/dashboard/pages/categorias/categorias').then(m => m.Categorias) },
      { path: 'permisos', loadComponent: () => import('./components/dashboard/pages/permisos/permisos').then(m => m.Permisos) },

    ]
  },
];
