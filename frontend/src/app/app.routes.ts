import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { LayoutComponent } from './layout/layout.component'; // If using a layout wrapper
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'budget-entry',
        loadComponent: () =>
          import('./budget-entry/budget-entry.component').then(
            (m) => m.BudgetEntryComponent
          ),
      },
      {
        path: 'budget-form',
        loadComponent: () =>
          import('./budget-form/budget-form.component').then(
            (m) => m.BudgetFormComponent
          ),
      },
      {
        path: 'budget-history',
        loadComponent: () =>
          import('./budget-history/budget-history.component').then(
            (m) => m.BudgetHistoryComponent
          ),
      },
    ],
  },
];
