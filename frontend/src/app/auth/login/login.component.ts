import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // For ngModel, ngForm
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // For *ngIf, *ngFor, etc.
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule], // ✅ Add all necessary modules
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    this.isLoading = true;

    this.authService
      .login(this.email, this.password)
      .subscribe((isAuthenticated) => {
        this.isLoading = false;
        if (isAuthenticated) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Invalid email or password';
        }
      });
  }

  handleForgotPassword(event: Event): void {
    event.preventDefault();
    const email = prompt('Please enter your email address:');
    if (email && this.validateEmail(email)) {
      alert(`Password reset link will be sent to ${email}`);
    } else {
      alert('Please enter a valid email address');
    }
  }

  private validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}
