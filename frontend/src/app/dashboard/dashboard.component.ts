import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AuthService } from '../auth/auth.service';

interface BudgetItem {
  category: string;
  budgeted: number;
  spent: number;
  remaining: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  showSidebar: boolean = true; // Add this property
  currentMonth: string = new Date().toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });
  userName: string = 'User';
  userInitials: string = 'U';
  budgetData: BudgetItem[] = [];
  filteredBudgetData: BudgetItem[] = [];
  searchTerm: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadBudgetData();
    // Set sidebar visibility based on auth status
    this.showSidebar = this.authService.isLoggedIn();
  }

  private loadUserData(): void {
    const userEmail =
      this.authService.getCurrentUserEmail() || 'user@example.com';
    this.userName = userEmail.split('@')[0];
    this.userInitials = this.userName.charAt(0).toUpperCase();
  }

  private loadBudgetData(): void {
    // Mock data - replace with actual API call
    this.budgetData = [
      { category: 'Food', budgeted: 15000, spent: 12500, remaining: 2500 },
      { category: 'Transport', budgeted: 8000, spent: 7500, remaining: 500 },
      {
        category: 'Entertainment',
        budgeted: 5000,
        spent: 6200,
        remaining: -1200,
      },
      { category: 'Utilities', budgeted: 10000, spent: 9500, remaining: 500 },
      { category: 'Rent', budgeted: 30000, spent: 30000, remaining: 0 },
    ];
    this.filteredBudgetData = [...this.budgetData];
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase();
    this.filterData();
  }

  onCategoryFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase();
    this.filterData();
  }

  private filterData(): void {
    if (!this.searchTerm) {
      this.filteredBudgetData = [...this.budgetData];
      return;
    }
    this.filteredBudgetData = this.budgetData.filter((item) =>
      item.category.toLowerCase().includes(this.searchTerm)
    );
  }

  getRemainingClass(remaining: number): string {
    if (remaining > 0) return 'positive';
    if (remaining < 0) return 'negative';
    return 'neutral';
  }
}
