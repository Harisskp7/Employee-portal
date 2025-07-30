import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { LeaveRecord, LeaveBalance } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private mockLeaveRecords: LeaveRecord[] = [
    {
      id: '1',
      type: 'Annual Leave',
      startDate: '2024-01-15',
      endDate: '2024-01-17',
      days: 3,
      status: 'Approved',
      reason: 'Personal work',
      appliedDate: '2024-01-10'
    },
    {
      id: '2',
      type: 'Sick Leave',
      startDate: '2024-02-05',
      endDate: '2024-02-06',
      days: 2,
      status: 'Approved',
      reason: 'Fever and cold',
      appliedDate: '2024-02-05'
    },
    {
      id: '3',
      type: 'Casual Leave',
      startDate: '2024-03-20',
      endDate: '2024-03-20',
      days: 1,
      status: 'Pending',
      reason: 'Family function',
      appliedDate: '2024-03-18'
    }
  ];

  private mockLeaveBalances: LeaveBalance[] = [
    { type: 'Annual Leave', total: 21, used: 5, available: 16 },
    { type: 'Sick Leave', total: 12, used: 2, available: 10 },
    { type: 'Casual Leave', total: 10, used: 3, available: 7 },
    { type: 'Maternity Leave', total: 180, used: 0, available: 180 }
  ];

  getLeaveHistory(): Observable<LeaveRecord[]> {
    return of(this.mockLeaveRecords).pipe(delay(500));
  }

  getLeaveBalances(): Observable<LeaveBalance[]> {
    return of(this.mockLeaveBalances).pipe(delay(500));
  }

  applyLeave(leaveData: Partial<LeaveRecord>): Observable<{ success: boolean; message: string }> {
    return of({
      success: true,
      message: 'Leave application submitted successfully'
    }).pipe(delay(1000));
  }
}