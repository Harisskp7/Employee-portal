import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Employee, LoginRequest, LoginResponse, ProfileResponse, LeaveResponse, PayslipResponse } from '../models/employee.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Employee | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private apiUrl = 'http://localhost:5000/api/employee';

  constructor(private http: HttpClient) {
    // Load user from localStorage on service initialization
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error loading user from storage:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }

  // Mock employee data
  private mockEmployee: Employee = {
    id: 'EMP001',
    name: 'John Doe',
    email: 'john.doe@kaartech.com',
    department: 'Information Technology',
    position: 'Senior Software Developer',
    joiningDate: '2022-01-15',
    manager: 'Jane Smith'
  };

  login(employeeId: string, password: string): Observable<LoginResponse> {
    const loginData: LoginRequest = {
      EMPLOYEE_ID: employeeId,
      PASSWORD: password
    };

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginData);
  }

  getProfile(employeeId?: string): Observable<ProfileResponse> {
    const currentEmployeeId = employeeId || this.getCurrentEmployeeId();
    if (!currentEmployeeId) {
      throw new Error('No employee ID available');
    }
    console.log('Fetching profile for employee ID:', currentEmployeeId);
    
    // The backend expects a POST request with EMPLOYEE_ID in the body
    const requestBody = {
      EMPLOYEE_ID: currentEmployeeId
    };
    
    // Add headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    return this.http.post<ProfileResponse>(`${this.apiUrl}/profile`, requestBody, { headers });
  }

  getLeaveData(employeeId?: string): Observable<LeaveResponse> {
    const currentEmployeeId = employeeId || this.getCurrentEmployeeId();
    if (!currentEmployeeId) {
      throw new Error('No employee ID available');
    }
    console.log('Fetching leave data for employee ID:', currentEmployeeId);
    
    // The backend expects a POST request with EMPLOYEE_ID in the body
    const requestBody = {
      EMPLOYEE_ID: currentEmployeeId
    };
    
    // Add headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    return this.http.post<LeaveResponse>(`${this.apiUrl}/leave`, requestBody, { headers });
  }

  getPayslipData(employeeId?: string): Observable<PayslipResponse> {
    const currentEmployeeId = employeeId || this.getCurrentEmployeeId();
    if (!currentEmployeeId) {
      throw new Error('No employee ID available');
    }
    console.log('Fetching payslip data for employee ID:', currentEmployeeId);
    
    // The backend expects a POST request with EMPLOYEE_ID in the body
    const requestBody = {
      EMPLOYEE_ID: currentEmployeeId
    };
    
    // Add headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    return this.http.post<PayslipResponse>(`${this.apiUrl}/payslip`, requestBody, { headers });
  }

  // Test method to check if backend is running
  testBackendConnection(): Observable<any> {
    return this.http.get(`${this.apiUrl}/login`, { 
      headers: { 'Accept': 'application/json' } 
    });
  }

  getCurrentEmployeeId(): string | null {
    const currentUser = this.getCurrentUser();
    return currentUser ? currentUser.id : null;
  }

  setCurrentUser(employee: Employee): void {
    this.currentUserSubject.next(employee);
    // Store in localStorage
    localStorage.setItem('currentUser', JSON.stringify(employee));
  }

  logout(): void {
    this.currentUserSubject.next(null);
    // Clear from localStorage
    localStorage.removeItem('currentUser');
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): Employee | null {
    return this.currentUserSubject.value;
  }
}