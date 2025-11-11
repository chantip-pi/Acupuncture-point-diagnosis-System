import { IPatientRepository } from "~/domain/repositories/IPatientRepository";
import { Patient } from "~/domain/entities/Patient";

export class GetPatientListUseCase {
  constructor(private readonly patientRepository: IPatientRepository) {}

  async execute(): Promise<Patient[]> {
    const patients = await this.patientRepository.getAll();
    return patients.sort((a, b) => a.patient_id - b.patient_id);
  }
}

