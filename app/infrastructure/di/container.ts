import { FetchHttpClient, HttpClient } from "../http/HttpClient";
import { API_CONFIG } from "../config/api.config";
import { PatientRepository } from "../repositories/PatientRepository";
import { StaffRepository } from "../repositories/StaffRepository";
import { AddPatientUseCase } from "~/application/use-cases/patient/AddPatientUseCase";
import { GetPatientListUseCase } from "~/application/use-cases/patient/GetPatientListUseCase";
import { GetPatientByIdUseCase } from "~/application/use-cases/patient/GetPatientByIdUseCase";
import { UpdatePatientUseCase } from "~/application/use-cases/patient/UpdatePatientUseCase";
import { GetPatientsByAppointmentDateUseCase } from "~/application/use-cases/patient/GetPatientsByAppointmentDateUseCase";
import { LoginUseCase } from "~/application/use-cases/staff/LoginUseCase";
import { GetStaffListUseCase } from "~/application/use-cases/staff/GetStaffListUseCase";
import { GetStaffByUsernameUseCase } from "~/application/use-cases/staff/GetStaffByUsernameUseCase";

// Infrastructure
const httpClient: HttpClient = new FetchHttpClient(API_CONFIG.baseUrl);
const patientRepository = new PatientRepository(httpClient);
const staffRepository = new StaffRepository(httpClient);

// Use Cases
export const addPatientUseCase = new AddPatientUseCase(patientRepository);
export const getPatientListUseCase = new GetPatientListUseCase(patientRepository);
export const getPatientByIdUseCase = new GetPatientByIdUseCase(patientRepository);
export const updatePatientUseCase = new UpdatePatientUseCase(patientRepository);
export const getPatientsByAppointmentDateUseCase = new GetPatientsByAppointmentDateUseCase(patientRepository);

export const loginUseCase = new LoginUseCase(staffRepository);
export const getStaffListUseCase = new GetStaffListUseCase(staffRepository);
export const getStaffByUsernameUseCase = new GetStaffByUsernameUseCase(staffRepository);

