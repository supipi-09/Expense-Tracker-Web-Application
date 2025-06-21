import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, Event, NavigationEnd } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  isExpensesExpanded = false;
  isBudgetsExpanded = false;
  private routerSub!: Subscription;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Auto-expand sections based on current route
    this.routerSub = this.router.events
      .pipe(
        filter(
          (event: Event): event is NavigationEnd =>
            event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.updateExpandedSections(event.urlAfterRedirects);
      });

    // Initial check for current route
    this.updateExpandedSections(this.router.url);
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  toggleExpenses(): void {
    this.isExpensesExpanded = !this.isExpensesExpanded;
    // Collapse budgets if expanding expenses (mutually exclusive)
    if (this.isExpensesExpanded) {
      this.isBudgetsExpanded = false;
    }
  }

  toggleBudgets(): void {
    this.isBudgetsExpanded = !this.isBudgetsExpanded;
    // Collapse expenses if expanding budgets (mutually exclusive)
    if (this.isBudgetsExpanded) {
      this.isExpensesExpanded = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isActiveRoute(routePath: string): boolean {
    return this.router.url.includes(routePath);
  }

  private updateExpandedSections(currentUrl: string): void {
    // Auto-expand sections based on current route
    this.isExpensesExpanded =
      currentUrl.includes('budget-entry') ||
      currentUrl.includes('budget-history');
    this.isBudgetsExpanded = currentUrl.includes('budget-form');

    // If we're on the dashboard but not in any sub-route, expand budgets by default
    if (
      currentUrl.includes('dashboard') &&
      !this.isExpensesExpanded &&
      !this.isBudgetsExpanded
    ) {
      this.isBudgetsExpanded = true;
    }
  }
}
