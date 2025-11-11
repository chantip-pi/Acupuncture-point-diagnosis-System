import { IPatientRepository } from "~/domain/repositories/IPatientRepository";
import { CreatePatientDTO } from "~/application/dtos/PatientDTO";
import { PatientValidationService } from "~/domain/services/PatientValidationService";

export class AddPatientUseCase {
  constructor(private readonly patientRepository: IPatientRepository) {}

  async execute(dto: CreatePatientDTO): Promise<void> {
    // Validate input
    if (!PatientValidationService.validatePhoneNumber(dto.phone_number)) {
      throw new Error("Telephone number must be 10 digits.");
    }

    if (!PatientValidationService.validateBirthday(dto.birthday)) {
      throw new Error("Birthday cannot be in the future.");
    }

    if (!PatientValidationService.validateCourseCount(dto.course_count)) {
      throw new Error("Course count cannot be negative.");
    }

    if (!PatientValidationService.validateAppointmentDate(dto.appointment_date)) {
      throw new Error("You need to provide an appointment date.");
    }

    // Check appointment date availability
    const existingPatients = await this.patientRepository.getByAppointmentDate(
      new Date(dto.appointment_date).toISOString()
    );

    if (existingPatients.length > 0) {
      throw new Error("The selected appointment date is already taken. Please choose a different date.");
    }

    // Create patient
    await this.patientRepository.create(dto);
  }
}

