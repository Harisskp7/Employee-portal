import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Employee } from '../../models/employee.model';
import { ProfileComponent } from '../profile/profile.component';
import { LeaveManagementComponent } from '../leave-management/leave-management.component';
import { PayslipComponent } from '../payslip/payslip.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ProfileComponent, LeaveManagementComponent, PayslipComponent],
  template: `
    <div class="office365-dashboard">
      <!-- Office 365 Header -->
      <header class="office365-header">
        <div class="header-container">
          <div class="header-left">
            <div class="app-launcher">
              <svg class="hamburger-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              </svg>
            </div>
            <div class="logo-section">
              <div class="office-logo">
                <svg class="office-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <span class="app-name">Employee Portal</span>
            </div>
          </div>
          
          <div class="header-center">
            <div class="search-container">
              <svg class="search-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <input type="text" placeholder="Search..." class="search-input">
            </div>
          </div>
          
          <div class="header-right">
            <div class="user-info" *ngIf="currentEmployee">
              <div class="user-avatar">
                <svg class="avatar-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <div class="user-details">
                <span class="user-name">{{ currentEmployee.name }}</span>
                <span class="user-email">{{ currentEmployee.id }}</span>
              </div>
              <button class="logout-btn" (click)="logout()">
                <svg class="logout-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div class="main-content">
        <!-- Office 365 Sidebar -->
        <aside class="office365-sidebar">
          <nav class="sidebar-nav">
            <div class="nav-section">
              <h3 class="nav-section-title">Apps</h3>
              <div class="nav-item" 
                   [class.active]="activeSection === 'dashboard'"
                   (click)="setActiveSection('dashboard')">
                <div class="nav-icon">
                  <svg class="icon-svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                  </svg>
                </div>
                <span class="nav-text">Dashboard</span>
              </div>
              
              <div class="nav-item" 
                   [class.active]="activeSection === 'profile'"
                   (click)="setActiveSection('profile')">
                <div class="nav-icon">
                  <svg class="icon-svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <span class="nav-text">My Profile</span>
              </div>
              
              <div class="nav-item" 
                   [class.active]="activeSection === 'leave'"
                   (click)="setActiveSection('leave')">
                <div class="nav-icon">
                  <svg class="icon-svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                  </svg>
                </div>
                <span class="nav-text">Leave Management</span>
              </div>
              
              <div class="nav-item" 
                   [class.active]="activeSection === 'payslip'"
                   (click)="setActiveSection('payslip')">
                <div class="nav-icon">
                  <svg class="icon-svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                  </svg>
                </div>
                <span class="nav-text">Payslip</span>
              </div>
            </div>
          </nav>
        </aside>

        <!-- Office 365 Content Area -->
        <main class="office365-content">
          <!-- Dashboard Section -->
          <div *ngIf="activeSection === 'dashboard'" class="dashboard-section">
            <div class="section-header">
              <h1 class="section-title">Welcome to your Employee Portal</h1>
              <p class="section-subtitle" *ngIf="currentEmployee">
                Hello {{ currentEmployee.name }}, here's what you can do today
              </p>
            </div>
            
            <div class="quick-actions">
              <h2 class="quick-actions-title">Quick Actions</h2>
              <div class="action-cards">
                <div class="action-card" (click)="setActiveSection('profile')">
                  <div class="card-icon">
                    <svg class="icon-svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <div class="card-content">
                    <h3 class="card-title">My Profile</h3>
                    <p class="card-description">View and update your personal information</p>
                  </div>
                  <div class="card-arrow">
                    <svg class="arrow-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                    </svg>
                  </div>
                </div>
                
                <div class="action-card" (click)="setActiveSection('leave')">
                  <div class="card-icon">
                    <svg class="icon-svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                    </svg>
                  </div>
                  <div class="card-content">
                    <h3 class="card-title">Leave Management</h3>
                    <p class="card-description">Apply for leave and check your balance</p>
                  </div>
                  <div class="card-arrow">
                    <svg class="arrow-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                    </svg>
                  </div>
                </div>
                
                <div class="action-card" (click)="setActiveSection('payslip')">
                  <div class="card-icon">
                    <svg class="icon-svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                    </svg>
                  </div>
                  <div class="card-content">
                    <h3 class="card-title">Payslip</h3>
                    <p class="card-description">Download and view your salary details</p>
                  </div>
                  <div class="card-arrow">
                    <svg class="arrow-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Profile Section -->
          <div *ngIf="activeSection === 'profile'" class="section-content">
            <app-profile></app-profile>
          </div>

          <!-- Leave Section -->
          <div *ngIf="activeSection === 'leave'" class="section-content">
            <app-leave-management></app-leave-management>
          </div>

          <!-- Payslip Section -->
          <div *ngIf="activeSection === 'payslip'" class="section-content">
            <app-payslip></app-payslip>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .office365-dashboard {
      min-height: 100vh;
      background-color: #f3f2f1;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      overflow-x: hidden;
    }

    .office365-header {
      background-color: #ffffff;
      border-bottom: 1px solid #e1dfdd;
      height: 48px;
      display: flex;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
      width: 100%;
      left: 0;
      right: 0;
      box-sizing: border-box;
    }

    .header-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 0 16px;
      max-width: 1400px;
      margin: 0 auto;
      height: 100%;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .app-launcher {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .app-launcher:hover {
      background-color: #f3f2f1;
    }

    .hamburger-icon {
      width: 20px;
      height: 20px;
      color: #323130;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .office-logo {
      width: 32px;
      height: 32px;
      background-color: #0078d4;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .office-icon {
      width: 20px;
      height: 20px;
      color: white;
    }

    .app-name {
      font-size: 16px;
      font-weight: 600;
      color: #323130;
    }

    .header-center {
      flex: 1;
      max-width: 400px;
      margin: 0 24px;
    }

    .search-container {
      position: relative;
      width: 100%;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 16px;
      height: 16px;
      color: #605e5c;
    }

    .search-input {
      width: 100%;
      height: 32px;
      padding: 0 12px 0 36px;
      border: 1px solid #e1dfdd;
      border-radius: 4px;
      font-size: 14px;
      background-color: #ffffff;
      transition: border-color 0.2s;
    }

    .search-input:focus {
      outline: none;
      border-color: #0078d4;
    }

    .header-right {
      display: flex;
      align-items: center;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .user-info:hover {
      background-color: #f3f2f1;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      background-color: #0078d4;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .avatar-icon {
      width: 18px;
      height: 18px;
      color: white;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .user-name {
      font-size: 14px;
      font-weight: 600;
      color: #323130;
    }

    .user-email {
      font-size: 12px;
      color: #605e5c;
    }

    .logout-btn {
      width: 32px;
      height: 32px;
      border: none;
      background: none;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;
    }

    .logout-btn:hover {
      background-color: #f3f2f1;
    }

    .logout-icon {
      width: 16px;
      height: 16px;
      color: #605e5c;
    }

    .main-content {
      display: flex;
      height: calc(100vh - 48px);
    }

    .office365-sidebar {
      width: 240px;
      background-color: #ffffff;
      border-right: 1px solid #e1dfdd;
      padding: 16px 0;
    }

    .sidebar-nav {
      padding: 0 8px;
    }

    .nav-section {
      margin-bottom: 24px;
    }

    .nav-section-title {
      font-size: 12px;
      font-weight: 600;
      color: #605e5c;
      text-transform: uppercase;
      margin: 0 0 8px 16px;
      letter-spacing: 0.5px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
      margin-bottom: 2px;
    }

    .nav-item:hover {
      background-color: #f3f2f1;
    }

    .nav-item.active {
      background-color: #deecf9;
      color: #0078d4;
    }

    .nav-icon {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .icon-svg {
      width: 16px;
      height: 16px;
      color: #605e5c;
    }

    .nav-item.active .icon-svg {
      color: #0078d4;
    }

    .nav-text {
      font-size: 14px;
      font-weight: 500;
      color: #323130;
    }

    .nav-item.active .nav-text {
      color: #0078d4;
      font-weight: 600;
    }

    .office365-content {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
    }

    .dashboard-section {
      max-width: 1200px;
      margin: 0 auto;
    }

    .section-header {
      margin-bottom: 32px;
    }

    .section-title {
      font-size: 28px;
      font-weight: 600;
      color: #323130;
      margin: 0 0 8px 0;
    }

    .section-subtitle {
      font-size: 16px;
      color: #605e5c;
      margin: 0;
    }

    .quick-actions {
      margin-top: 32px;
    }

    .quick-actions-title {
      font-size: 20px;
      font-weight: 600;
      color: #323130;
      margin: 0 0 16px 0;
    }

    .action-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 16px;
      max-width: 1200px;
    }

    .action-card {
      background-color: #ffffff;
      border: 1px solid #e1dfdd;
      border-radius: 8px;
      padding: 24px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 16px;
      height: 100px;
      min-width: 320px;
    }

    .action-card:hover {
      border-color: #0078d4;
      box-shadow: 0 2px 8px rgba(0, 120, 212, 0.15);
      transform: translateY(-1px);
    }

    .card-icon {
      width: 48px;
      height: 48px;
      background-color: #deecf9;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .card-icon .icon-svg {
      width: 24px;
      height: 24px;
      color: #0078d4;
    }

    .card-content {
      flex: 1;
      min-width: 0;
    }

    .card-title {
      font-size: 16px;
      font-weight: 600;
      color: #323130;
      margin: 0 0 4px 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-description {
      font-size: 14px;
      color: #605e5c;
      margin: 0;
      line-height: 1.4;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-arrow {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .arrow-icon {
      width: 16px;
      height: 16px;
      color: #605e5c;
      transition: transform 0.2s;
    }

    .action-card:hover .arrow-icon {
      transform: translateX(2px);
      color: #0078d4;
    }

    .section-content {
      max-width: 1200px;
      margin: 0 auto;
    }

    @media (max-width: 1024px) {
      .header-center {
        display: none;
      }
      
      .office365-sidebar {
        width: 200px;
      }
      
      .header-container {
        padding: 0 12px;
      }
    }

    @media (max-width: 1024px) {
      .action-cards {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 14px;
      }
      
      .action-card {
        min-width: 280px;
        height: 90px;
        padding: 20px;
      }
      
      .card-icon {
        width: 40px;
        height: 40px;
      }
      
      .card-icon .icon-svg {
        width: 20px;
        height: 20px;
      }
    }

    @media (max-width: 768px) {
      .office365-header {
        position: fixed;
        width: 100vw;
      }
      
      .header-container {
        padding: 0 12px;
      }
      
      .app-name {
        display: none;
      }
      
      .user-details {
        display: none;
      }
      
      .main-content {
        flex-direction: column;
        height: auto;
        margin-top: 48px;
      }
      
      .office365-sidebar {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid #e1dfdd;
        padding: 12px 0;
      }
      
      .sidebar-nav {
        display: flex;
        overflow-x: auto;
        padding: 0 12px;
        gap: 8px;
      }
      
      .nav-section {
        margin-bottom: 0;
        display: flex;
        gap: 8px;
      }
      
      .nav-section-title {
        display: none;
      }
      
      .nav-item {
        white-space: nowrap;
        min-width: fit-content;
        padding: 8px 12px;
      }
      
      .office365-content {
        padding: 16px;
      }
      
      .action-cards {
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 12px;
      }
      
      .action-card {
        min-width: 240px;
        height: 80px;
        padding: 16px;
      }
      
      .card-icon {
        width: 36px;
        height: 36px;
      }
      
      .card-icon .icon-svg {
        width: 18px;
        height: 18px;
      }
      
      .card-title {
        font-size: 15px;
      }
      
      .card-description {
        font-size: 13px;
      }
    }

    @media (max-width: 480px) {
      .office365-header {
        width: 100vw;
      }
      
      .header-container {
        padding: 0 8px;
      }
      
      .office365-content {
        padding: 12px;
      }
      
      .section-title {
        font-size: 24px;
      }
      
      .action-cards {
        grid-template-columns: 1fr;
        gap: 10px;
      }
      
      .action-card {
        min-width: unset;
        height: 70px;
        padding: 14px;
      }
      
      .card-icon {
        width: 32px;
        height: 32px;
      }
      
      .card-icon .icon-svg {
        width: 16px;
        height: 16px;
      }
      
      .card-title {
        font-size: 14px;
      }
      
      .card-description {
        font-size: 12px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentEmployee: Employee | null = null;
  activeSection = 'dashboard';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentEmployee = this.authService.getCurrentUser();
    if (!this.currentEmployee) {
      this.router.navigate(['/login']);
    }
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
  }

  navigateTo(section: string): void {
    this.setActiveSection(section);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}