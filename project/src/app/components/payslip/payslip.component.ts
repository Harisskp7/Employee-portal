import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { PayslipResponse } from '../../models/employee.model';

@Component({
  selector: 'app-payslip',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payslip.component.html',
  styleUrls: ['./payslip.component.css']
})
export class PayslipComponent implements OnInit {
  payslipData: PayslipResponse['data'] | null = null;
  isLoading = true;
  errorMessage = '';
  selectedMonth = '';
  selectedYear = '';
  isDownloading = false;

  // Available months and years for filtering
  availableMonths = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  availableYears = [
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
    { value: '2020', label: '2020' }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Set default values to current month and year
    const currentDate = new Date();
    this.selectedMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    this.selectedYear = currentDate.getFullYear().toString();
    
    this.loadPayslipData();
  }

  loadPayslipData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.getPayslipData().subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Payslip response:', response);
        if (response.success) {
          this.payslipData = response.data;
          console.log('Payslip data loaded:', this.payslipData);
        } else {
          this.errorMessage = response.message || 'Failed to load payslip data.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Payslip error:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url
        });
        
        if (error.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please check your internet connection.';
        } else if (error.status === 404) {
          this.errorMessage = 'Payslip endpoint not found. Please contact support.';
        } else if (error.status === 400) {
          this.errorMessage = 'Invalid request. Please check your employee ID.';
        } else if (error.status === 500) {
          this.errorMessage = 'Server error. Please try again later.';
        } else {
          this.errorMessage = `Failed to load payslip data. Error: ${error.message || 'Unknown error'}`;
        }
      }
    });
  }

  onFilterChange(): void {
    // Reload data when filter changes
    this.loadPayslipData();
  }

  getSelectedPeriod(): string {
    if (!this.selectedMonth || !this.selectedYear) return 'Current Period';
    
    const monthLabel = this.availableMonths.find(m => m.value === this.selectedMonth)?.label || '';
    return `${monthLabel} ${this.selectedYear}`;
  }

  formatAmount(amount: string): string {
    if (!amount) return '0.00';
    const numAmount = parseFloat(amount);
    return numAmount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
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

  getMonthlySalary(): string {
    return this.payslipData?.SALARY || '0.00';
  }

  getAnnualSalary(): string {
    return this.payslipData?.ANNUAL || '0.00';
  }

  getCapacity(): string {
    return this.payslipData?.CAPACITY || '0.00';
  }

  getWorkHours(): string {
    return this.payslipData?.WORKHRS || '0.00';
  }

  getCurrency(): string {
    return this.payslipData?.CURR || 'AUD';
  }

  getBankInfo(): string {
    if (!this.payslipData) return 'Not available';
    return `${this.payslipData.BANK_NAME} - ${this.payslipData.BANK_KEY}`;
  }

  getAccountNumber(): string {
    return this.payslipData?.ACC_NO || 'Not available';
  }

  getPayScaleInfo(): string {
    if (!this.payslipData) return 'Not available';
    const parts = [];
    if (this.payslipData.PAYTYPE) parts.push(`Type: ${this.payslipData.PAYTYPE}`);
    if (this.payslipData.PAYAREA) parts.push(`Area: ${this.payslipData.PAYAREA}`);
    if (this.payslipData.PAYGROUP) parts.push(`Group: ${this.payslipData.PAYGROUP}`);
    if (this.payslipData.PAYLEVEL) parts.push(`Level: ${this.payslipData.PAYLEVEL}`);
    return parts.length > 0 ? parts.join(', ') : 'Not available';
  }

  getWageType(): string {
    return this.payslipData?.WAGETYPE || 'Not available';
  }

  getCostCenter(): string {
    return this.payslipData?.COSTCENTER || 'Not available';
  }

  getEmployeeId(): string {
    return this.payslipData?.PERNR || 'Not available';
  }

  getEffectivePeriod(): string {
    if (!this.payslipData) return 'Not available';
    const startDate = this.formatDate(this.payslipData.BEGDA);
    const endDate = this.formatDate(this.payslipData.ENDDA);
    return `${startDate} to ${endDate}`;
  }

  downloadPayslip(employeeId: string, month: string, year: string): void {
    // Console log the three details
    console.log('Employee ID:', employeeId);
    console.log('Month:', month);
    console.log('Year:', year);

    if (!this.payslipData) {
      console.error('No payslip data available for download');
      return;
    }

    this.isDownloading = true;

    // Create PDF content
    const pdfContent = this.generatePayslipPDF();
    
    // Create blob and download
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payslip-${month}-${year}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    this.isDownloading = false;
  }

  private generatePayslipPDF(): string {
    if (!this.payslipData) return '';

    const period = this.getSelectedPeriod();
    const employeeId = this.getEmployeeId();
    const monthlySalary = this.formatAmount(this.getMonthlySalary());
    const annualSalary = this.formatAmount(this.getAnnualSalary());
    const currency = this.getCurrency();
    const capacity = this.getCapacity();
    const workHours = this.getWorkHours();

    // Simple HTML-based PDF content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payslip - ${period}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
          .section { margin: 20px 0; }
          .section h3 { color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
          .info-row { display: flex; justify-content: space-between; margin: 5px 0; }
          .label { font-weight: bold; }
          .value { text-align: right; }
          .total { font-weight: bold; font-size: 16px; background: #f0f0f0; padding: 10px; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>EMPLOYEE PAYSLIP</h1>
          <h2>${period}</h2>
        </div>
        
        <div class="section">
          <h3>Employee Information</h3>
          <div class="info-row">
            <span class="label">Employee ID:</span>
            <span class="value">${employeeId}</span>
          </div>
          <div class="info-row">
            <span class="label">Cost Center:</span>
            <span class="value">${this.getCostCenter()}</span>
          </div>
          <div class="info-row">
            <span class="label">Wage Type:</span>
            <span class="value">${this.getWageType()}</span>
          </div>
          <div class="info-row">
            <span class="label">Effective Period:</span>
            <span class="value">${this.getEffectivePeriod()}</span>
          </div>
        </div>

        <div class="section">
          <h3>Bank Information</h3>
          <div class="info-row">
            <span class="label">Bank Name:</span>
            <span class="value">${this.payslipData.BANK_NAME}</span>
          </div>
          <div class="info-row">
            <span class="label">Bank Key:</span>
            <span class="value">${this.payslipData.BANK_KEY}</span>
          </div>
          <div class="info-row">
            <span class="label">Account Number:</span>
            <span class="value">${this.getAccountNumber()}</span>
          </div>
          <div class="info-row">
            <span class="label">Currency:</span>
            <span class="value">${currency}</span>
          </div>
        </div>

        <div class="section">
          <h3>Pay Scale Information</h3>
          <div class="info-row">
            <span class="label">Pay Type:</span>
            <span class="value">${this.payslipData.PAYTYPE || 'Not specified'}</span>
          </div>
          <div class="info-row">
            <span class="label">Pay Area:</span>
            <span class="value">${this.payslipData.PAYAREA || 'Not specified'}</span>
          </div>
          <div class="info-row">
            <span class="label">Pay Group:</span>
            <span class="value">${this.payslipData.PAYGROUP || 'Not specified'}</span>
          </div>
          <div class="info-row">
            <span class="label">Pay Level:</span>
            <span class="value">${this.payslipData.PAYLEVEL || 'Not specified'}</span>
          </div>
        </div>

        <div class="section">
          <h3>Salary Details</h3>
          <div class="info-row">
            <span class="label">Basic Salary:</span>
            <span class="value">${currency} ${monthlySalary}</span>
          </div>
          <div class="info-row total">
            <span class="label">Total Monthly Salary:</span>
            <span class="value">${currency} ${monthlySalary}</span>
          </div>
          <div class="info-row total">
            <span class="label">Annual Salary:</span>
            <span class="value">${currency} ${annualSalary}</span>
          </div>
        </div>

        <div class="section">
          <h3>Additional Information</h3>
          <div class="info-row">
            <span class="label">Capacity:</span>
            <span class="value">${capacity}%</span>
          </div>
          <div class="info-row">
            <span class="label">Work Hours:</span>
            <span class="value">${workHours} hours</span>
          </div>
        </div>

        <div class="footer">
          <p>This document was generated on ${new Date().toLocaleDateString()}</p>
          <p>Employee Portal System</p>
        </div>
      </body>
      </html>
    `;

    return htmlContent;
  }
}