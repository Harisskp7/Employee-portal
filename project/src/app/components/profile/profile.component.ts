import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Employee, ProfileData } from '../../models/employee.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileData: ProfileData | null = null;
  isLoading = true;
  errorMessage = '';
  currentEmployeeId: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadProfileData();
  }

  loadProfileData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Get current employee ID
    this.currentEmployeeId = this.authService.getCurrentEmployeeId();
    console.log('Current Employee ID:', this.currentEmployeeId);

    if (!this.currentEmployeeId) {
      this.isLoading = false;
      this.errorMessage = 'No employee ID found. Please login again.';
      return;
    }

    // Test the API connection first
    this.testApiConnection();

    this.authService.getProfile(this.currentEmployeeId).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Profile response:', response);
        if (response.success) {
          this.profileData = response.data;
          console.log('Profile data loaded:', this.profileData);
        } else {
          this.errorMessage = response.message || 'Failed to load profile data.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Profile error:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url
        });
        
        if (error.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please check your internet connection.';
        } else if (error.status === 404) {
          this.errorMessage = 'Profile endpoint not found. Please contact support.';
        } else if (error.status === 400) {
          this.errorMessage = 'Invalid request. Please check your employee ID.';
        } else if (error.status === 500) {
          this.errorMessage = 'Server error. Please try again later.';
        } else {
          this.errorMessage = `Failed to load profile data. Error: ${error.message || 'Unknown error'}`;
        }
      }
    });
  }

  testApiConnection(): void {
    console.log('Testing API connection...');
    console.log('API URL:', 'http://localhost:5000/api/employee/profile');
    console.log('Employee ID:', this.currentEmployeeId);
    console.log('Request Method: POST');
    console.log('Request Body:', { EMPLOYEE_ID: this.currentEmployeeId });
  }

  getInitials(firstName: string, lastName: string): string {
    if (!firstName || !lastName) return 'NA';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Not specified';
    try {
    const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    } catch (error) {
      return 'Invalid date';
    }
  }

  getFullName(): string {
    if (!this.profileData) return 'Employee';
    const firstName = this.profileData.FIRST_NAME || '';
    const lastName = this.profileData.LAST_NAME || '';
    return `${firstName} ${lastName}`.trim() || 'Employee';
  }
}