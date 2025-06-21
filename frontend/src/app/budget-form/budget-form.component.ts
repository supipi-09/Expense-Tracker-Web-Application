import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

interface Budget {
  userId: string;
  category: string;
  budgetAmount: number;
  status: 'OK' | 'Overspent';
}

interface CategoryOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-budget-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './budget-form.component.html',
  styleUrls: ['./budget-form.component.css'],
})
export class BudgetFormComponent implements OnInit {
  budgetForm: FormGroup;
  budgets: Budget[] = [];
  filteredBudgets: Budget[] = [];
  searchTerm: string = '';
  tableSearchTerm: string = '';
  userName: string = 'John Doe';
  userInitials: string = 'JD';

  categories: CategoryOption[] = [
    { value: 'food', label: 'Food & Dining' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'housing', label: 'Housing' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'education', label: 'Education' },
    { value: 'savings', label: 'Savings' },
    { value: 'other', label: 'Other' },
  ];

  constructor(private fb: FormBuilder) {
    this.budgetForm = this.fb.group({
      userId: ['user1', Validators.required],
      category: ['', Validators.required],
      budgetAmount: ['', [Validators.required, Validators.min(0.01)]],
    });
  }

  ngOnInit(): void {
    // Initialize with some mock data
    this.budgets = [
      { userId: 'user1', category: 'food', budgetAmount: 10000, status: 'OK' },
      {
        userId: 'user1',
        category: 'transportation',
        budgetAmount: 5000,
        status: 'Overspent',
      },
      {
        userId: 'user1',
        category: 'housing',
        budgetAmount: 30000,
        status: 'OK',
      },
    ];
    this.filteredBudgets = [...this.budgets];
  }

  onSubmit(): void {
    if (this.budgetForm.valid) {
      const formValue = this.budgetForm.value;
      const existingIndex = this.budgets.findIndex(
        (b) => b.category === formValue.category
      );

      // For demo purposes, randomly assign status
      const status: 'OK' | 'Overspent' =
        Math.random() > 0.5 ? 'OK' : 'Overspent';

      const newBudget: Budget = {
        userId: formValue.userId,
        category: formValue.category,
        budgetAmount: formValue.budgetAmount,
        status: status,
      };

      if (existingIndex >= 0) {
        // Update existing budget
        this.budgets[existingIndex] = newBudget;
      } else {
        // Add new budget
        this.budgets.push(newBudget);
      }

      this.filteredBudgets = [...this.budgets];
      this.onClear();
    }
  }

  onClear(): void {
    this.budgetForm.reset({
      userId: 'user1',
    });
  }

  onEdit(budget: Budget): void {
    this.budgetForm.patchValue({
      userId: budget.userId,
      category: budget.category,
      budgetAmount: budget.budgetAmount,
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase();
  }

  onTableSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.tableSearchTerm = input.value.toLowerCase();
    this.filteredBudgets = this.budgets.filter((budget) =>
      budget.category.toLowerCase().includes(this.tableSearchTerm)
    );
  }

  getStatusClass(status: string): string {
    return status === 'OK' ? 'positive' : 'negative';
  }

  trackByCategory(index: number, budget: Budget): string {
    return budget.category;
  }
}
