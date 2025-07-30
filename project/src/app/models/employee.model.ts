export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  joiningDate: string;
  manager: string;
  profileImage?: string;
}

// Login request interface matching backend API
export interface LoginRequest {
  EMPLOYEE_ID: string;
  PASSWORD: string;
}

// Login response interface matching backend API
export interface LoginResponse {
  success: boolean;
  message: string;
}

// Profile data interface matching backend API
export interface ProfileData {
  PERSNO: string;
  FIRST_NAME: string;
  LAST_NAME: string;
  EMAIL: string;
  GENDER: string;
  DOB: string;
  JOIN_DATE: string;
  COMPANY: string;
  COM_NAME: string;
  COM_STREET: string;
  COM_CITY: string;
  COMP_PIN: string;
  COM_COUNTRY: string;
  COM_COUNTRY_TXT: string;
  CITY: string;
  PIN_CODE: string;
  COUNTRY: string;
  COUNTRY_TXT: string;
  NATIONALITY: string;
  NATIONALITY_TXT: string;
  EMP_GROUP: string;
  EMP_SUBGROUP: string;
  PERS_AREA: string;
  PERS_SUBAREA: string;
}

// Profile response interface matching backend API
export interface ProfileResponse {
  success: boolean;
  data: ProfileData;
  message?: string;
}

export interface LeaveRecord {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: string;
  reason: string;
  appliedDate: string;
}

// Leave absence data from backend
export interface LeaveAbsence {
  PERNR: string;
  BEGDA: string;
  ENDDA: string;
  STDAZ: string;
  ABWTG: string;
  AWART: string;
  KTART: string;
  ANZHL: string;
  REASON: string;
}

// Leave quota data from backend
export interface LeaveQuota {
  PERNR: string;
  BEGDA: string;
  ENDDA: string;
  STDAZ: string;
  ABWTG: string;
  AWART: string;
  KTART: string;
  ANZHL: string;
  REASON: string;
}

// Leave management response from backend
export interface LeaveResponse {
  success: boolean;
  data: {
    EV_TOTAL_QUOTA: string;
    EV_LEAVE_TAKEN: string;
    EV_HOURS: string;
    EV_DAYS: string;
    ET_ABSENCES: LeaveAbsence[];
    ET_QUOTAS: LeaveQuota[];
  };
  message?: string;
}

export interface LeaveBalance {
  type: string;
  total: number;
  used: number;
  available: number;
}

export interface PayslipData {
  employeeId: string;
  month: string;
  year: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  payDate: string;
}

// Payslip data from backend RFC
export interface PayslipResponse {
  success: boolean;
  data: {
    PERNR: string;
    COSTCENTER: string;
    PAYTYPE: string;
    PAYAREA: string;
    PAYGROUP: string;
    PAYLEVEL: string;
    WAGETYPE: string;
    CURR: string;
    SALARY: string;
    ANNUAL: string;
    CAPACITY: string;
    WORKHRS: string;
    BANK_NAME: string;
    BANK_KEY: string;
    ACC_NO: string;
    BEGDA: string;
    ENDDA: string;
  };
  message?: string;
}