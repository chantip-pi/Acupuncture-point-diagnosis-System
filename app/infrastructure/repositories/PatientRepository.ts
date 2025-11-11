import { IPatientRepository } from "~/domain/repositories/IPatientRepository";
import { Patient } from "~/domain/entities/Patient";
import { HttpClient } from "../http/HttpClient";
import { API_CONFIG } from "../config/api.config";

export class PatientRepository implements IPatientRepository {
  constructor(private readonly httpClient: HttpClient) {}

  async getAll(): Promise<Patient[]> {
    const data = await this.httpClient.get<Patient[]>(API_CONFIG.endpoints.patient.list);
    return Array.isArray(data) ? data : [];
  }

  async getById(id: number): Promise<Patient | null> {
    const data = await this.httpClient.get<Patient[]>(API_CONFIG.endpoints.patient.getById(id));
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  }

  async getByAppointmentDate(date: string): Promise<Patient[]> {
    const data = await this.httpClient.get<Patient[]>(
      API_CONFIG.endpoints.patient.getByAppointmentDate(date)
    );
    return Array.isArray(data) ? data : [];
  }

  async create(patient: Omit<Patient, "patient_id">): Promise<Patient> {
    const data = await this.httpClient.post<Patient>(
      API_CONFIG.endpoints.patient.create,
      patient
    );
    return data;
  }

  async update(patient: Patient): Promise<Patient> {
    const data = await this.httpClient.post<Patient>(
      API_CONFIG.endpoints.patient.update,
      patient
    );
    return data;
  }
}

