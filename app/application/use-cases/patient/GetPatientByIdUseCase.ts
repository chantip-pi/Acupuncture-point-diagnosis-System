import { IPatientRepository } from "~/domain/repositories/IPatientRepository";
import { Patient } from "~/domain/entities/Patient";

export class GetPatientByIdUseCase {
  constructor(private readonly patientRepository: IPatientRepository) {}

  async execute(id: number): Promise<Patient | null> {
    return await this.patientRepository.getById(id);
  }
}

