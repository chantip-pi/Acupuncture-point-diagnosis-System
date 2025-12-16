import { IPatientRepository } from "~/domain/repositories/IPatientRepository";
import { Patient } from "~/domain/entities/Patient";
import { PatientDataSource } from "~/infrastructure/datasource/PatientDataSource"


export class PatientRepository implements IPatientRepository {
  constructor(private readonly dataSource: PatientDataSource) {}


  async getAll(): Promise<Patient[]> {
    return this.dataSource.getAll();
  }

  async getById(id: number): Promise<Patient | null> {
    return this.dataSource.getById(id);
  }


  async create(patient: Omit<Patient, "patientId">): Promise<Patient> {
    return this.dataSource.create(patient);
  }

  async update(patient: Patient): Promise<Patient> {
    return this.dataSource.update(patient);
  }


  async delete(patientId: number): Promise<void> {
    return this.dataSource.delete(patientId);
  }
}

