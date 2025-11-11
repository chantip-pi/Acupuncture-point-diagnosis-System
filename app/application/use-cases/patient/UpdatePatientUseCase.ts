import { IPatientRepository } from "~/domain/repositories/IPatientRepository";
import { UpdatePatientDTO } from "~/application/dtos/PatientDTO";
import { PatientValidationService } from "~/domain/services/PatientValidationService";

export class UpdatePatientUseCase {
  constructor(private readonly patientRepository: IPatientRepository) {}

  async execute(dto: UpdatePatientDTO): Promise<void> {
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

    if (dto.appointment_date && !PatientValidationService.validateAppointmentDate(dto.appointment_date)) {
      throw new Error("Please select an appointment date.");
    }

    // Check appointment date availability if provided
    if (dto.appointment_date) {
      const existingPatients = await this.patientRepository.getByAppointmentDate(
        new Date(dto.appointment_date).toISOString()
      );

      // Exclude current patient from the check
      const conflictingPatients = existingPatients.filter(
        (p) => p.patient_id !== dto.patient_id
      );

      if (conflictingPatients.length > 0) {
        throw new Error("The selected appointment date is already taken. Please choose a different date.");
      }
    }

    // Update patient
    await this.patientRepository.update(dto);
  }
}

