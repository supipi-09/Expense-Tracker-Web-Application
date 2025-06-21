import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Expense {
  id: number;
  date: string;
  category: string;
  description: string;
  amount: number;
}

@Component({
  selector: 'app-budget-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './budget-history.component.html',
  styleUrls: ['./budget-history.component.css'],
})
export class BudgetHistoryComponent implements OnInit {
  // Header properties
  userInitials: string = 'JD';
  userName: string = 'John Doe';

  // Search and filter properties
  searchTerm: string = '';
  fromDate: string = '';
  toDate: string = '';

  // Data properties
  expenses: Expense[] = [];
  filteredExpenses: Expense[] = [];

  // Mock data for demonstration
  private mockExpenses: Expense[] = [
    {
      id: 1,
      date: '2024-01-15',
      category: 'Food & Dining',
      description: 'Lunch at Restaurant ABC',
      amount: 2500,
    },
    {
      id: 2,
      date: '2024-01-16',
      category: 'Transportation',
      description: 'Uber ride to office',
      amount: 800,
    },
    {
      id: 3,
      date: '2024-01-17',
      category: 'Shopping',
      description: 'Grocery shopping at Supermarket',
      amount: 4500,
    },
    {
      id: 4,
      date: '2024-01-18',
      category: 'Entertainment',
      description: 'Movie tickets for 2',
      amount: 1800,
    },
    {
      id: 5,
      date: '2024-01-19',
      category: 'Health & Fitness',
      description: 'Gym membership monthly fee',
      amount: 3000,
    },
    {
      id: 6,
      date: '2024-01-20',
      category: 'Food & Dining',
      description: 'Coffee and pastry',
      amount: 650,
    },
    {
      id: 7,
      date: '2024-01-21',
      category: 'Transportation',
      description: 'Bus fare',
      amount: 120,
    },
    {
      id: 8,
      date: '2024-01-22',
      category: 'Utilities',
      description: 'Electricity bill payment',
      amount: 5500,
    },
    {
      id: 9,
      date: '2024-01-23',
      category: 'Shopping',
      description: 'Online shopping - Electronics',
      amount: 12000,
    },
    {
      id: 10,
      date: '2024-01-24',
      category: 'Food & Dining',
      description: 'Dinner with friends',
      amount: 3200,
    },
    {
      id: 11,
      date: '2024-02-01',
      category: 'Health & Fitness',
      description: 'Doctor consultation',
      amount: 2000,
    },
    {
      id: 12,
      date: '2024-02-02',
      category: 'Entertainment',
      description: 'Streaming service subscription',
      amount: 800,
    },
    {
      id: 13,
      date: '2024-02-03',
      category: 'Transportation',
      description: 'Fuel for car',
      amount: 4000,
    },
    {
      id: 14,
      date: '2024-02-04',
      category: 'Food & Dining',
      description: 'Office cafeteria',
      amount: 450,
    },
    {
      id: 15,
      date: '2024-02-05',
      category: 'Shopping',
      description: 'Clothing purchase',
      amount: 6500,
    },
  ];

  constructor() {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  /**
   * Load expenses data
   */
  loadExpenses(): void {
    this.expenses = [...this.mockExpenses];
    this.filteredExpenses = [...this.mockExpenses];
  }

  /**
   * Handle search input from header
   */
  onSearch(event?: any): void {
    const searchValue = event?.target?.value || this.searchTerm;
    this.searchTerm = searchValue;
    this.applyFilters();
  }

  /**
   * Handle show button click with date filters
   */
  onShow(): void {
    this.applyFilters();
  }

  /**
   * Apply all filters (search term and date range)
   */
  private applyFilters(): void {
    let filtered = [...this.expenses];

    // Apply search filter
    if (this.searchTerm && this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (expense) =>
          expense.description.toLowerCase().includes(searchLower) ||
          expense.category.toLowerCase().includes(searchLower) ||
          expense.amount.toString().includes(searchLower)
      );
    }

    // Apply date range filter
    if (this.fromDate) {
      filtered = filtered.filter((expense) => expense.date >= this.fromDate);
    }

    if (this.toDate) {
      filtered = filtered.filter((expense) => expense.date <= this.toDate);
    }

    this.filteredExpenses = filtered;
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.searchTerm = '';
    this.fromDate = '';
    this.toDate = '';
    this.filteredExpenses = [...this.expenses];
  }

  /**
   * Format currency for display
   */
  formatCurrency(amount: number): string {
    return `Rs. ${amount.toLocaleString()}`;
  }

  /**
   * Handle edit expense
   */
  onEdit(expense: Expense): void {
    console.log('Edit expense:', expense);
    alert(
      `Edit expense: ${expense.description}\nAmount: ${this.formatCurrency(
        expense.amount
      )}`
    );
  }

  /**
   * Handle delete expense
   */
  onDelete(expense: Expense): void {
    console.log('Delete expense:', expense);

    // Show confirmation dialog
    const confirmed = confirm(
      `Are you sure you want to delete this expense?\n\n${
        expense.description
      }\n${this.formatCurrency(expense.amount)}`
    );

    if (confirmed) {
      // Remove from both arrays
      this.expenses = this.expenses.filter((e) => e.id !== expense.id);
      this.filteredExpenses = this.filteredExpenses.filter(
        (e) => e.id !== expense.id
      );

      console.log('Expense deleted successfully');
    }
  }

  /**
   * Track by function for ngFor performance
   */
  trackByExpenseId(index: number, expense: Expense): number {
    return expense.id;
  }

  /**
   * Get formatted date for display
   */
  getFormattedDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  /**
   * Get category color class (for future styling)
   */
  getCategoryClass(category: string): string {
    const categoryClasses: { [key: string]: string } = {
      'Food & Dining': 'category-food',
      Transportation: 'category-transport',
      Shopping: 'category-shopping',
      Entertainment: 'category-entertainment',
      'Health & Fitness': 'category-health',
      Utilities: 'category-utilities',
    };

    return categoryClasses[category] || 'category-default';
  }

  /**
   * Export filtered expenses to CSV (bonus feature)
   */
  exportToCSV(): void {
    if (this.filteredExpenses.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = ['Date', 'Category', 'Description', 'Amount'];
    const csvContent = [
      headers.join(','),
      ...this.filteredExpenses.map((expense) =>
        [
          expense.date,
          `"${expense.category}"`,
          `"${expense.description}"`,
          expense.amount,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expense-history-${
      new Date().toISOString().split('T')[0]
    }.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Get total amount of filtered expenses
   */
  getTotalAmount(): number {
    return this.filteredExpenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );
  }

  /**
   * Get expense statistics
   */
  getExpenseStats(): { [key: string]: number } {
    const stats: { [key: string]: number } = {};

    this.filteredExpenses.forEach((expense) => {
      if (stats[expense.category]) {
        stats[expense.category] += expense.amount;
      } else {
        stats[expense.category] = expense.amount;
      }
    });

    return stats;
  }

  /**
   * Refresh data
   */
  refreshData(): void {
    console.log('Refreshing expense data...');
    this.loadExpenses();
  }
}
