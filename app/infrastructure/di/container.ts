import { FetchHttpClient, HttpClient } from "../http/HttpClient";
import { API_CONFIG } from "../config/api.config";
import { DATASOURCE_CONFIG } from "../config/datasource.config";
import { IPatientRepository } from "~/domain/repositories/IPatientRepository";
import { IStaffRepository } from "~/domain/repositories/IStaffRepository";
import { PatientRepository } from "../repositories/PatientRepository";
import { StaffRepository } from "../repositories/StaffRepository";
import { MockPatientRepository } from "../repositories/MockPatientRepository";
import { MockStaffRepository } from "../repositories/MockStaffRepository";
import { MockDataSource } from "../datasource/MockDataSource";
import { AddPatientUseCase } from "~/application/use-cases/patient/AddPatientUseCase";
import { AddStaffUseCase } from "~/application/use-cases/staff/AddStaffUseCase";
import { GetPatientListUseCase } from "~/application/use-cases/patient/GetPatientListUseCase";
import { GetPatientByIdUseCase } from "~/application/use-cases/patient/GetPatientByIdUseCase";
import { UpdatePatientUseCase } from "~/application/use-cases/patient/UpdatePatientUseCase";
import { GetPatientsByAppointmentDateUseCase } from "~/application/use-cases/patient/GetPatientsByAppointmentDateUseCase";
import { LoginUseCase } from "~/application/use-cases/staff/LoginUseCase";
import { GetStaffListUseCase } from "~/application/use-cases/staff/GetStaffListUseCase";
import { GetStaffByUsernameUseCase } from "~/application/use-cases/staff/GetStaffByUsernameUseCase";

// Initialize repositories based on datasource configuration
let patientRepository: IPatientRepository;
let staffRepository: IStaffRepository;

if (DATASOURCE_CONFIG.type === "mock") {
  // Use mock datasource
  const mockDataSource = MockDataSource.getInstance();
  patientRepository = new MockPatientRepository(mockDataSource);
  staffRepository = new MockStaffRepository(mockDataSource);
} else {
  // Use real API datasource
  const httpClient: HttpClient = new FetchHttpClient(API_CONFIG.baseUrl);
  patientRepository = new PatientRepository(httpClient);
  staffRepository = new StaffRepository(httpClient);
}

// Use Cases
export const addPatientUseCase = new AddPatientUseCase(patientRepository);
export const getPatientListUseCase = new GetPatientListUseCase(patientRepository);
export const getPatientByIdUseCase = new GetPatientByIdUseCase(patientRepository);
export const updatePatientUseCase = new UpdatePatientUseCase(patientRepository);
export const getPatientsByAppointmentDateUseCase = new GetPatientsByAppointmentDateUseCase(patientRepository);

export const loginUseCase = new LoginUseCase(staffRepository);
export const getStaffListUseCase = new GetStaffListUseCase(staffRepository);
export const getStaffByUsernameUseCase = new GetStaffByUsernameUseCase(staffRepository);
export const addStaffUseCase = new AddStaffUseCase(staffRepository);

