import { IPatientRepository } from "~/domain/repositories/IPatientRepository";
import { Patient } from "~/domain/entities/Patient";

export class GetPatientsByAppointmentDateUseCase {
  constructor(private readonly patientRepository: IPatientRepository) {}

  async execute(date: Date): Promise<Patient[]> {
    const isoDate = date.toISOString();
    return await this.patientRepository.getByAppointmentDate(isoDate);
  }
}

