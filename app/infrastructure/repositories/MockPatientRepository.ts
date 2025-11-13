import { IPatientRepository } from "~/domain/repositories/IPatientRepository";
import { Patient } from "~/domain/entities/Patient";
import { MockDataSource } from "../datasource/MockDataSource";

/**
 * Mock implementation of PatientRepository using in-memory datasource.
 * This can be easily swapped with the real PatientRepository.
 */
export class MockPatientRepository implements IPatientRepository {
  constructor(private readonly dataSource: MockDataSource) {}

  async getAll(): Promise<Patient[]> {
    return this.dataSource.getAllPatients();
  }

  async getById(id: number): Promise<Patient | null> {
    return this.dataSource.getPatientById(id);
  }

  async getByAppointmentDate(date: string): Promise<Patient[]> {
    return this.dataSource.getPatientsByAppointmentDate(date);
  }

  async create(patient: Omit<Patient, "patient_id">): Promise<Patient> {
    return this.dataSource.createPatient(patient);
  }

  async update(patient: Patient): Promise<Patient> {
    return this.dataSource.updatePatient(patient);
  }
}

