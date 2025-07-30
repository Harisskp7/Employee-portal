import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PayslipData } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class PayslipService {
  private mockPayslips: PayslipData[] = [
    {
      employeeId: 'EMP001',
      month: 'December',
      year: '2024',
      basicSalary: 50000,
      allowances: 15000,
      deductions: 8000,
      netSalary: 57000,
      payDate: '2024-12-28'
    },
    {
      employeeId: 'EMP001',
      month: 'November',
      year: '2024',
      basicSalary: 50000,
      allowances: 15000,
      deductions: 8000,
      netSalary: 57000,
      payDate: '2024-11-28'
    },
    {
      employeeId: 'EMP001',
      month: 'October',
      year: '2024',
      basicSalary: 50000,
      allowances: 15000,
      deductions: 8000,
      netSalary: 57000,
      payDate: '2024-10-28'
    }
  ];

  getPayslips(): Observable<PayslipData[]> {
    return of(this.mockPayslips).pipe(delay(500));
  }

  getPayslip(month: string, year: string): Observable<PayslipData | null> {
    const payslip = this.mockPayslips.find(p => p.month === month && p.year === year);
    return of(payslip || null).pipe(delay(500));
  }

  downloadPayslip(payslip: PayslipData): Observable<{ success: boolean; message: string }> {
    // Simulate PDF download
    return of({
      success: true,
      message: 'Payslip downloaded successfully'
    }).pipe(delay(1000));
  }

  emailPayslip(payslip: PayslipData, email: string): Observable<{ success: boolean; message: string }> {
    // Simulate email sending
    return of({
      success: true,
      message: `Payslip sent to ${email} successfully`
    }).pipe(delay(1500));
  }
}