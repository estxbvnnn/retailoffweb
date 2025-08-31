import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/auth/login.page').then(m => m.LoginPage) },
  { path: 'register', loadComponent: () => import('./pages/auth/register.page').then(m => m.RegisterPage) },
  // Alias de información (usa HistoryPage como placeholder, cámbialo cuando tengas informacion.page)
  { path: 'informacion', loadComponent: () => import('./pages/history/history.page').then(m => m.HistoryPage) },
  {
    path: 'tabs',
    loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    children: [
      { path: 'scan', loadComponent: () => import('./pages/scan/scan.page').then(m => m.ScanPage) },
      { path: 'history', loadComponent: () => import('./pages/history/history.page').then(m => m.HistoryPage) },
      { path: '', redirectTo: 'scan', pathMatch: 'full' },
    ],
  },
  { path: 'mision', loadComponent: () => import('./mision/mision.page').then(m => m.MisionPage) },
  { path: 'perfil', loadComponent: () => import('./perfil/perfil.page').then(m => m.PerfilPage) },
  { path: '**', redirectTo: 'login' },
];
