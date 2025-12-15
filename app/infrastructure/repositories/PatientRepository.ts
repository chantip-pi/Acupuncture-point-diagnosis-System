import { IPatientRepository } from "~/domain/repositories/IPatientRepository";
import { Patient } from "~/domain/entities/Patient";
import { MockDataSource } from "../datasource/MockDataSource";


export class PatientRepository implements IPatientRepository {
  constructor(private readonly dataSource: MockDataSource) {}

  async getAll(): Promise<Patient[]> {
    return this.dataSource.getAllPatients();
  }

  async getById(id: number): Promise<Patient | null> {
    return this.dataSource.getPatientById(id);
  }


  async create(patient: Omit<Patient, "patientId">): Promise<Patient> {
    return this.dataSource.createPatient(patient);
  }

  async update(patient: Patient): Promise<Patient> {
    return this.dataSource.updatePatient(patient);
  }

}

