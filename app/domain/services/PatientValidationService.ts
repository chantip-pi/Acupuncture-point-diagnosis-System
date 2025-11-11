import { PhoneNumber } from "../value-objects/PhoneNumber";
import { DateOfBirth } from "../value-objects/DateOfBirth";

export class PatientValidationService {
  static validatePhoneNumber(phoneNumber: string): boolean {
    try {
      PhoneNumber.create(phoneNumber);
      return true;
    } catch {
      return false;
    }
  }

  static validateBirthday(birthday: string): boolean {
    try {
      DateOfBirth.create(birthday);
      return true;
    } catch {
      return false;
    }
  }

  static validateCourseCount(courseCount: number): boolean {
    return courseCount >= 0 && !isNaN(courseCount);
  }

  static validateAppointmentDate(appointmentDate: string): boolean {
    return appointmentDate !== null && appointmentDate !== undefined && appointmentDate !== "";
  }
}

