import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface ExpenseEntry {
  id: number;
  userId: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  createdAt: Date;
}

interface Category {
  value: string;
  label: string;
}

@Component({
  selector: 'app-budget-entry',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './budget-entry.component.html',
  styleUrls: ['./budget-entry.component.css'],
})
export class BudgetEntryComponent implements OnInit {
  // User properties (added to fix the error)
  userInitials: string = 'JD';
  userName: string = 'John Doe';

  // Search and filter properties
  searchTerm: string = '';
  fromDate: string = '';
  toDate: string = '';

  expenseForm: FormGroup;
  showAddCategoryModal = false;
  newCategoryName = '';

  categories: Category[] = [
    { value: 'groceries', label: 'Groceries' },
    { value: 'rent', label: 'Rent' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'food', label: 'Food & Dining' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'shopping', label: 'Shopping' },
  ];

  expenses: ExpenseEntry[] = [];
  private nextId = 1;

  constructor(private formBuilder: FormBuilder) {
    this.expenseForm = this.createForm();
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      userId: ['', [Validators.required]],
      category: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      date: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  private initializeForm(): void {
    const today = new Date().toISOString().split('T')[0];
    this.expenseForm.patchValue({
      date: today,
    });
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.expenseForm.get(controlName);
    return control
      ? control.hasError(errorType) && (control.dirty || control.touched)
      : false;
  }

  getErrorMessage(controlName: string): string {
    const control = this.expenseForm.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('min')) {
      return 'Amount must be greater than 0';
    }
    if (control?.hasError('minlength')) {
      return 'Description must be at least 3 characters';
    }
    return '';
  }

  onSubmit(): void {
    if (this.expenseForm.valid) {
      const newExpense: ExpenseEntry = {
        id: this.nextId++,
        userId: this.expenseForm.value.userId,
        category: this.expenseForm.value.category,
        amount: this.expenseForm.value.amount,
        date: this.expenseForm.value.date,
        description: this.expenseForm.value.description,
        createdAt: new Date(),
      };
      this.expenses.push(newExpense);
      console.log('New expense added:', newExpense);
      this.onClear();
    } else {
      this.expenseForm.markAllAsTouched();
    }
  }

  onClear(): void {
    this.expenseForm.reset();
    this.initializeForm();
  }

  onAddNewCategory(): void {
    this.showAddCategoryModal = true;
  }

  closeAddCategoryModal(): void {
    this.showAddCategoryModal = false;
    this.newCategoryName = '';
  }

  addNewCategory(): void {
    if (this.newCategoryName.trim()) {
      const newCategory = {
        value: this.newCategoryName.toLowerCase().replace(/\s+/g, '-'),
        label: this.newCategoryName.trim(),
      };
      this.categories.push(newCategory);
      this.expenseForm.patchValue({
        category: newCategory.value,
      });
      this.closeAddCategoryModal();
    }
  }

  // Add this method to handle search functionality
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase();
    // Add your search filtering logic here if needed
  }
}
