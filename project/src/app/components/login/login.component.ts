import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  employeeId = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.employeeId || !this.password) {
      this.errorMessage = 'Please enter both employee ID and password.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.employeeId, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          // For now, we'll use mock employee data since the backend only returns success/message
          // In a real scenario, you'd want the backend to return employee data
          const mockEmployee: Employee = {
            id: this.employeeId,
            name: 'Employee',
            email: `${this.employeeId}@kaartech.com`,
            department: 'Information Technology',
            position: 'Software Developer',
            joiningDate: '2023-01-01',
            manager: 'Manager'
          };
          this.authService.setCurrentUser(mockEmployee);
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = response.message || 'Login failed. Please try again.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login error:', error);
        this.errorMessage = 'Login failed. Please check your credentials and try again.';
      }
    });
  }
}