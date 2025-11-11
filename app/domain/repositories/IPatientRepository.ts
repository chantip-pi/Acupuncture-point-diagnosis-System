import { Patient } from "../entities/Patient";

export interface IPatientRepository {
  getAll(): Promise<Patient[]>;
  getById(id: number): Promise<Patient | null>;
  getByAppointmentDate(date: string): Promise<Patient[]>;
  create(patient: Omit<Patient, "patient_id">): Promise<Patient>;
  update(patient: Patient): Promise<Patient>;
}

