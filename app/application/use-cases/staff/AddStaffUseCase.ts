import { IStaffRepository } from "~/domain/repositories/IStaffRepository";
import { CreateStaffDTO } from "~/application/dtos/StaffDTO";
import { StaffValidationService } from "~/domain/services/StaffValidationService";

export class AddStaffUseCase {
  constructor(private readonly staffRepository: IStaffRepository) {}

  async execute(dto: CreateStaffDTO): Promise<void> {
    // Validate input
    if (!StaffValidationService.validatePhoneNumber(dto.phoneNumber)) {
      throw new Error("Telephone number must be 10 digits.");
    }

    if (!StaffValidationService.validateBirthday(dto.birthday)) {
      throw new Error("Birthday cannot be in the future.");
    }

    // Check appointment date availability
    const existingStaffs = await this.staffRepository.getByUsername(
      dto.username
    );

    if (existingStaffs && Array.isArray(existingStaffs) && existingStaffs.length > 0) {
      throw new Error("The selected username is already taken. Please choose a different username.");
    }

    // Create staff
    await this.staffRepository.create(dto);
  }
}

