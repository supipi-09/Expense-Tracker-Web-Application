// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth/auth.guard';
import { BudgetEntryComponent } from './budget-entry/budget-entry.component';
import { BudgetHistoryComponent } from './budget-history/budget-history.component';
import { BudgetFormComponent } from './budget-form/budget-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { authRequired: true },
    children: [
      { path: 'budget-entry', component: BudgetEntryComponent },
      { path: 'budget-history', component: BudgetHistoryComponent },
      { path: 'budget-form', component: BudgetFormComponent },
    ],
  },
];
