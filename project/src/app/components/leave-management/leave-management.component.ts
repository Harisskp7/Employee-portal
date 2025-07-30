import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LeaveAbsence, LeaveQuota, LeaveResponse } from '../../models/employee.model';

@Component({
  selector: 'app-leave-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leave-management.component.html',
  styleUrls: ['./leave-management.component.css']
})
export class LeaveManagementComponent implements OnInit {
  leaveData: LeaveResponse['data'] | null = null;
  isLoading = true;
  errorMessage = '';
  selectedLeaveType = '';
  filteredAbsences: LeaveAbsence[] = [];
  filteredQuotas: LeaveQuota[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadLeaveData();
  }

  loadLeaveData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.getLeaveData().subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Leave response:', response);
        if (response.success) {
          this.leaveData = response.data;
          this.filteredAbsences = response.data.ET_ABSENCES || [];
          this.filteredQuotas = response.data.ET_QUOTAS || [];
          console.log('Leave data loaded:', this.leaveData);
        } else {
          this.errorMessage = response.message || 'Failed to load leave data.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Leave error:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url
        });
        
        if (error.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please check your internet connection.';
        } else if (error.status === 404) {
          this.errorMessage = 'Leave endpoint not found. Please contact support.';
        } else if (error.status === 400) {
          this.errorMessage = 'Invalid request. Please check your employee ID.';
        } else if (error.status === 500) {
          this.errorMessage = 'Server error. Please try again later.';
        } else {
          this.errorMessage = `Failed to load leave data. Error: ${error.message || 'Unknown error'}`;
        }
      }
    });
  }

  filterLeaves(): void {
    if (!this.leaveData) return;

    if (this.selectedLeaveType) {
      this.filteredAbsences = this.leaveData.ET_ABSENCES.filter(
        absence => absence.REASON === this.selectedLeaveType
      );
      this.filteredQuotas = this.leaveData.ET_QUOTAS.filter(
        quota => quota.REASON === this.selectedLeaveType
      );
    } else {
      this.filteredAbsences = this.leaveData.ET_ABSENCES || [];
      this.filteredQuotas = this.leaveData.ET_QUOTAS || [];
    }
  }

  // Get leave type class based on RFC AWART codes
  getLeaveTypeClass(reason: string): string {
    switch (reason) {
      case 'Paid Leave':
        return 'paid-leave';
      case 'Loss of Pay':
        return 'loss-of-pay';
      case 'Sick Leave':
        return 'sick-leave';
      case 'Staff meeting':
        return 'staff-meeting';
      case 'Long-term illness':
        return 'long-term-illness';
      case 'Annual Leave':
        return 'annual-leave';
      case 'Compensatory Off':
        return 'compensatory-off';
      case 'Other Quota Type':
        return 'other-quota';
      case 'Other Leave':
        return 'other-leave';
      default:
        return 'other-leave';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Not specified';
    try {
    const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    } catch (error) {
      return 'Invalid date';
    }
  }

  calculateDays(startDate: string, endDate: string): number {
    if (!startDate || !endDate) return 0;
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays + 1; // Include both start and end dates
    } catch (error) {
      return 0;
    }
  }

  getTotalQuota(): string {
    return this.leaveData?.EV_TOTAL_QUOTA || '0';
  }

  getLeaveTaken(): string {
    return this.leaveData?.EV_LEAVE_TAKEN || '0';
  }

  getAvailableQuota(): number {
    const total = parseFloat(this.getTotalQuota());
    const taken = parseFloat(this.getLeaveTaken());
    return Math.max(0, total - taken);
  }

  getQuotaPercentage(): number {
    const total = parseFloat(this.getTotalQuota());
    const taken = parseFloat(this.getLeaveTaken());
    if (total === 0) return 0;
    return (taken / total) * 100;
  }

  // Get available leave types based on RFC data
  getAvailableLeaveTypes(): string[] {
    const types = new Set<string>();
    
    if (this.leaveData) {
      // Add types from absences
      this.leaveData.ET_ABSENCES.forEach(absence => {
        types.add(absence.REASON);
      });
      
      // Add types from quotas
      this.leaveData.ET_QUOTAS.forEach(quota => {
        types.add(quota.REASON);
      });
    }
    
    return Array.from(types).sort();
  }
}