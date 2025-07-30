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
    <div class="dashboard-premium">
      <!-- Premium Header -->
      <header class="header-premium">
        <div class="header-content">
          <div class="logo-section">
            <div class="logo-premium">
              <div class="logo-icon-premium">KT</div>
              <span class="company-name-premium">KaarTech</span>
            </div>
          </div>
          <div class="header-center">
            <h1 class="dashboard-title-premium">Employee Dashboard</h1>
            <p class="welcome-message-premium" *ngIf="currentEmployee">
              Welcome back, {{ currentEmployee.name }}! ({{ currentEmployee.id }})
            </p>
          </div>
          <div class="header-actions">
            <button class="btn-premium profile-btn-premium" (click)="navigateTo('profile')">
              <svg class="icon-svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              Profile
            </button>
            <button class="btn-premium logout-btn-premium" (click)="logout()">
              <svg class="icon-svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div class="main-content-premium">
        <!-- Premium Sidebar -->
        <aside class="sidebar-premium">
          <nav class="nav-menu-premium">
            <div class="nav-item-premium" 
                 [class.active]="activeSection === 'dashboard'"
                 (click)="setActiveSection('dashboard')">
              <div class="nav-icon-premium">
                <svg class="icon-svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
              </div>
              <span>Dashboard</span>
            </div>
            <div class="nav-item-premium" 
                 [class.active]="activeSection === 'profile'"
                 (click)="setActiveSection('profile')">
              <div class="nav-icon-premium">
                <svg class="icon-svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <span>Profile</span>
            </div>
            <div class="nav-item-premium" 
                 [class.active]="activeSection === 'leave'"
                 (click)="setActiveSection('leave')">
              <div class="nav-icon-premium">
                <svg class="icon-svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                </svg>
              </div>
              <span>Leave Management</span>
            </div>
            <div class="nav-item-premium" 
                 [class.active]="activeSection === 'payslip'"
                 (click)="setActiveSection('payslip')">
              <div class="nav-icon-premium">
                <svg class="icon-svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                </svg>
              </div>
              <span>Payslip</span>
            </div>
          </nav>
        </aside>

        <!-- Premium Content Area -->
        <main class="content-area-premium">
          <!-- Dashboard Section -->
          <div *ngIf="activeSection === 'dashboard'" class="section-premium">
            <div class="section-header-premium">
              <h2 class="section-title-premium">Quick Access</h2>
              <p class="section-subtitle-premium">Navigate to your most important features</p>
            </div>
            <div class="cards-grid-premium">
              <div class="card-premium quick-card-premium" (click)="setActiveSection('profile')">
                <div class="card-icon-premium profile-icon-premium">
                  <svg class="icon-svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <h3 class="card-title-premium">My Profile</h3>
                <p class="card-description-premium">View and manage your personal information</p>
                <div class="card-action-premium">
                  <span>View Details</span>
                  <svg class="arrow-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                  </svg>
                </div>
              </div>
              
              <div class="card-premium quick-card-premium" (click)="setActiveSection('leave')">
                <div class="card-icon-premium leave-icon-premium">
                  <svg class="icon-svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                  </svg>
                </div>
                <h3 class="card-title-premium">Leave Management</h3>
                <p class="card-description-premium">Apply for leave and check your balance</p>
                <div class="card-action-premium">
                  <span>View Details</span>
                  <svg class="arrow-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                  </svg>
                </div>
              </div>
              
              <div class="card-premium quick-card-premium" (click)="setActiveSection('payslip')">
                <div class="card-icon-premium payslip-icon-premium">
                  <svg class="icon-svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                  </svg>
                </div>
                <h3 class="card-title-premium">Payslip</h3>
                <p class="card-description-premium">Download and view your salary details</p>
                <div class="card-action-premium">
                  <span>View Details</span>
                  <svg class="arrow-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Profile Section -->
          <div *ngIf="activeSection === 'profile'" class="section-premium">
            <app-profile></app-profile>
          </div>

          <!-- Leave Section -->
          <div *ngIf="activeSection === 'leave'" class="section-premium">
            <app-leave-management></app-leave-management>
          </div>

          <!-- Payslip Section -->
          <div *ngIf="activeSection === 'payslip'" class="section-premium">
            <app-payslip></app-payslip>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-premium {
      min-height: 100vh;
      background: linear-gradient(135deg, #1a1a1a 0%, #2d1b1b 50%, #1a1a1a 100%);
      position: relative;
      overflow-x: hidden;
    }

    .dashboard-premium::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 20% 80%, rgba(220, 20, 60, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(139, 0, 0, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(255, 0, 0, 0.05) 0%, transparent 50%);
      pointer-events: none;
      z-index: 1;
    }

    .header-premium {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(220, 20, 60, 0.2);
      padding: 12px 0;
      position: relative;
      z-index: 10;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .logo-section {
      display: flex;
      align-items: center;
    }

    .logo-premium {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon-premium {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #8B0000, #DC143C);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 16px;
      color: white;
      box-shadow: 0 4px 15px rgba(220, 20, 60, 0.3);
      animation: pulse 2s infinite;
    }

    .company-name-premium {
      font-size: 18px;
      font-weight: 800;
      background: linear-gradient(135deg, #8B0000, #DC143C, #FF0000);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .header-center {
      text-align: center;
      flex: 1;
      margin: 0 32px;
    }

    .dashboard-title-premium {
      font-size: 24px;
      font-weight: 900;
      background: linear-gradient(135deg, #8B0000, #DC143C, #FF0000);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 4px 0;
      text-shadow: 0 0 20px rgba(220, 20, 60, 0.3);
    }

    .welcome-message-premium {
      font-size: 14px;
      color: #333;
      margin: 0;
      font-weight: 500;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .profile-btn-premium, .logout-btn-premium {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 12px;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .profile-btn-premium {
      background: linear-gradient(135deg, #8B0000, #DC143C);
      color: white;
      box-shadow: 0 4px 15px rgba(220, 20, 60, 0.3);
    }

    .logout-btn-premium {
      background: linear-gradient(135deg, #DC143C, #FF0000);
      color: white;
      box-shadow: 0 4px 15px rgba(220, 20, 60, 0.3);
    }

    .profile-btn-premium:hover, .logout-btn-premium:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(220, 20, 60, 0.5);
    }

    .icon-svg {
      width: 16px;
      height: 16px;
    }

    .main-content-premium {
      display: flex;
      height: calc(100vh - 80px);
      position: relative;
      z-index: 2;
    }

    .sidebar-premium {
      width: 240px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-right: 1px solid rgba(220, 20, 60, 0.2);
      padding: 20px 0;
      position: relative;
    }

    .nav-menu-premium {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 0 16px;
    }

    .nav-item-premium {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      color: #333;
      font-weight: 600;
      font-size: 14px;
      position: relative;
      overflow: hidden;
    }

    .nav-item-premium::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(220, 20, 60, 0.1), transparent);
      transition: left 0.5s;
    }

    .nav-item-premium:hover::before {
      left: 100%;
    }

    .nav-item-premium:hover {
      background: linear-gradient(135deg, #8B0000, #DC143C);
      color: white;
      transform: translateX(6px);
      box-shadow: 0 6px 20px rgba(220, 20, 60, 0.3);
    }

    .nav-item-premium.active {
      background: linear-gradient(135deg, #8B0000, #DC143C);
      color: white;
      box-shadow: 0 6px 20px rgba(220, 20, 60, 0.3);
    }

    .nav-icon-premium {
      width: 36px;
      height: 36px;
      background: rgba(220, 20, 60, 0.1);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: all 0.3s ease;
    }

    .nav-item-premium:hover .nav-icon-premium,
    .nav-item-premium.active .nav-icon-premium {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.1);
    }

    .nav-icon-premium .icon-svg {
      width: 18px;
      height: 18px;
    }

    .content-area-premium {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
    }

    .section-premium {
      max-width: 1200px;
      margin: 0 auto;
      height: 100%;
    }

    .section-header-premium {
      margin-bottom: 32px;
      text-align: center;
    }

    .section-title-premium {
      font-size: 32px;
      font-weight: 900;
      background: linear-gradient(135deg, #8B0000, #DC143C, #FF0000);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 12px 0;
      text-shadow: 0 0 20px rgba(220, 20, 60, 0.3);
    }

    .section-subtitle-premium {
      font-size: 18px;
      color: #333;
      margin: 0;
      font-weight: 500;
    }

    .cards-grid-premium {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      margin-top: 32px;
    }

    .quick-card-premium {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 16px;
      padding: 24px;
      cursor: pointer;
      transition: all 0.4s ease;
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(220, 20, 60, 0.1);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
      height: 160px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .quick-card-premium::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(135deg, #8B0000, #DC143C, #FF0000);
    }

    .quick-card-premium::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(220, 20, 60, 0.05), transparent);
      transition: left 0.6s;
    }

    .quick-card-premium:hover::after {
      left: 100%;
    }

    .quick-card-premium:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
      border-color: rgba(220, 20, 60, 0.3);
    }

    .card-icon-premium {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      margin-bottom: 16px;
      transition: all 0.3s ease;
    }

    .profile-icon-premium {
      background: linear-gradient(135deg, #8B0000, #DC143C);
      box-shadow: 0 6px 20px rgba(139, 0, 0, 0.3);
    }

    .leave-icon-premium {
      background: linear-gradient(135deg, #DC143C, #FF0000);
      box-shadow: 0 6px 20px rgba(220, 20, 60, 0.3);
    }

    .payslip-icon-premium {
      background: linear-gradient(135deg, #FF0000, #8B0000);
      box-shadow: 0 6px 20px rgba(255, 0, 0, 0.3);
    }

    .quick-card-premium:hover .card-icon-premium {
      transform: scale(1.1);
      box-shadow: 0 8px 25px rgba(220, 20, 60, 0.4);
    }

    .card-icon-premium .icon-svg {
      width: 24px;
      height: 24px;
      color: white;
    }

    .card-title-premium {
      font-size: 18px;
      font-weight: 800;
      color: #111827;
      margin: 0 0 8px 0;
    }

    .card-description-premium {
      color: #666;
      margin: 0 0 16px 0;
      line-height: 1.5;
      font-size: 14px;
      flex: 1;
    }

    .card-action-premium {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #DC143C;
      font-weight: 700;
      font-size: 13px;
      transition: all 0.3s ease;
    }

    .quick-card-premium:hover .card-action-premium {
      color: #8B0000;
    }

    .arrow-icon {
      width: 16px;
      height: 16px;
      transition: transform 0.3s ease;
    }

    .quick-card-premium:hover .arrow-icon {
      transform: translateX(4px);
    }

    @media (max-width: 1200px) {
      .header-content {
        padding: 0 20px;
      }

      .content-area-premium {
        padding: 20px;
      }

      .cards-grid-premium {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
      }
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 12px;
        text-align: center;
      }

      .header-center {
        margin: 0;
      }

      .dashboard-title-premium {
        font-size: 20px;
      }

      .main-content-premium {
        flex-direction: column;
        height: auto;
      }

      .sidebar-premium {
        width: 100%;
        padding: 16px 0;
      }

      .nav-menu-premium {
        flex-direction: row;
        overflow-x: auto;
        padding: 0 16px;
        gap: 8px;
      }

      .nav-item-premium {
        white-space: nowrap;
        min-width: fit-content;
        padding: 10px 12px;
        font-size: 12px;
      }

      .content-area-premium {
        padding: 16px;
      }

      .cards-grid-premium {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .quick-card-premium {
        padding: 20px;
        height: 140px;
      }

      .section-title-premium {
        font-size: 24px;
      }
    }

    @media (max-width: 480px) {
      .header-content {
        padding: 0 16px;
      }

      .logo-icon-premium {
        width: 36px;
        height: 36px;
        font-size: 14px;
      }

      .company-name-premium {
        font-size: 16px;
      }

      .dashboard-title-premium {
        font-size: 18px;
      }

      .quick-card-premium {
        padding: 16px;
        height: 120px;
      }

      .card-icon-premium {
        width: 40px;
        height: 40px;
        font-size: 18px;
      }

      .card-title-premium {
        font-size: 16px;
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