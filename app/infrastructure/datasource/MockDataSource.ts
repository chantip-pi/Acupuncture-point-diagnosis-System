import { Patient } from "~/domain/entities/Patient";
import { Staff } from "~/domain/entities/Staff";

/**
 * In-memory mock datasource for development and testing.
 * This can be easily replaced with a real database datasource in the future.
 */
export class MockDataSource {
  private static instance: MockDataSource;
  private patients: Patient[] = [];
  private staff: Staff[] = [];
  private nextPatientId = 1;
  private nextStaffId = 1;

  private constructor() {
    this.initializeDefaultData();
  }

  static getInstance(): MockDataSource {
    if (!MockDataSource.instance) {
      MockDataSource.instance = new MockDataSource();
    }
    return MockDataSource.instance;
  }

  /**
   * Initialize with default mock data
   */
  private initializeDefaultData(): void {
    // Default patients
    this.patients = [
      {
        patient_id: 1,
        name_surname: "Alice Tan",
        phone_number: "0812345678",
        birthday: "1988-04-12",
        gender: "Female",
        appointment_date: "2025-11-20T09:00:00Z",
        course_count: 3,
        first_visit_date: "2024-01-15",
      },
      {
        patient_id: 2,
        name_surname: "Bob Cruz",
        phone_number: "0823456789",
        birthday: "1975-11-02",
        gender: "Male",
        appointment_date: "2025-11-21T10:30:00Z",
        course_count: 5,
        first_visit_date: "2023-12-10",
      },
    ];

    // Default staff
    this.staff = [
      {
        staff_id: 1,
        username: "admin",
        password: "admin123", // In production, this should be hashed
        name_surname: "Dr. Lee",
        staff_phone_number: "0834567890",
        birthday: "1980-05-20",
        gender: "Male",
        email: "dr.lee@clinic.com",
        role: "Manager",
      },
      {
        staff_id: 2,
        username: "nurse.joy",
        password: "nurse123", // In production, this should be hashed
        name_surname: "Nurse Joy",
        staff_phone_number: "0845678901",
        birthday: "1990-08-15",
        gender: "Female",
        email: "nurse.joy@clinic.com",
        role: "Nurse",
      },
    ];

    this.nextPatientId = 3;
    this.nextStaffId = 3;
  }

  /**
   * Reset to default data (useful for testing)
   */
  reset(): void {
    this.patients = [];
    this.staff = [];
    this.nextPatientId = 1;
    this.nextStaffId = 1;
    this.initializeDefaultData();
  }

  // Patient operations
  async getAllPatients(): Promise<Patient[]> {
    await this.simulateDelay();
    return [...this.patients];
  }

  async getPatientById(id: number): Promise<Patient | null> {
    await this.simulateDelay();
    return this.patients.find((p) => p.patient_id === id) || null;
  }

  async getPatientsByAppointmentDate(date: string): Promise<Patient[]> {
    await this.simulateDelay();
    // Normalize date for comparison (compare date part only)
    const targetDate = new Date(date).toISOString().split("T")[0];
    return this.patients.filter((p) => {
      if (!p.appointment_date) return false;
      const patientDate = new Date(p.appointment_date).toISOString().split("T")[0];
      return patientDate === targetDate;
    });
  }

  async createPatient(patient: Omit<Patient, "patient_id">): Promise<Patient> {
    await this.simulateDelay();
    const newPatient: Patient = {
      ...patient,
      patient_id: this.nextPatientId++,
    };
    this.patients.push(newPatient);
    return { ...newPatient };
  }

  async updatePatient(patient: Patient): Promise<Patient> {
    await this.simulateDelay();
    const index = this.patients.findIndex((p) => p.patient_id === patient.patient_id);
    if (index === -1) {
      throw new Error(`Patient with id ${patient.patient_id} not found`);
    }
    this.patients[index] = { ...patient };
    return { ...this.patients[index] };
  }

  // Staff operations
  async getAllStaff(): Promise<Staff[]> {
    await this.simulateDelay();
    return [...this.staff];
  }

  async getStaffById(id: number): Promise<Staff | null> {
    await this.simulateDelay();
    return this.staff.find((s) => s.staff_id === id) || null;
  }

  async getStaffByUsername(username: string): Promise<Staff | null> {
    await this.simulateDelay();
    return this.staff.find((s) => s.username === username) || null;
  }

  async login(username: string, password: string): Promise<Staff | null> {
    await this.simulateDelay();
    const staff = this.staff.find(
      (s) => s.username === username && s.password === password
    );
    return staff ? { ...staff } : null;
  }

  async createStaff(staff: Omit<Staff, "staff_id">): Promise<Staff> {
    await this.simulateDelay();
    const newStaff: Staff = {
      ...staff,
      staff_id: this.nextStaffId++,
    };
    this.staff.push(newStaff);
    return { ...newStaff };
  }

  async updateStaff(staff: Staff): Promise<Staff> {
    await this.simulateDelay();
    const index = this.staff.findIndex((s) => s.staff_id === staff.staff_id);
    if (index === -1) {
      throw new Error(`Staff with id ${staff.staff_id} not found`);
    }
    this.staff[index] = { ...staff };
    return { ...this.staff[index] };
  }

  /**
   * Simulate network delay (50ms by default)
   */
  private async simulateDelay(ms: number = 50): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get current state (useful for debugging)
   */
  inspect(): { patients: Patient[]; staff: Staff[] } {
    return {
      patients: [...this.patients],
      staff: [...this.staff],
    };
  }
}

