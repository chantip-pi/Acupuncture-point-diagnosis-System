import { IStaffRepository } from "~/domain/repositories/IStaffRepository";
import { UpdateStaffDTO } from "~/application/dtos/StaffDTO";
import { StaffValidationService } from "~/domain/services/StaffValidationService";

export class UpdateStaffUseCase {
  constructor(private readonly staffRepository: IStaffRepository) {}

  async execute(dto: UpdateStaffDTO): Promise<void> {
    // Validate input
    if (!StaffValidationService.validatePhoneNumber(dto.phoneNumber)) {
      throw new Error("Telephone number must be 10 digits.");
    }

    if (!StaffValidationService.validateBirthday(dto.birthday)) {
      throw new Error("Birthday cannot be in the future.");
    }

    // Update patient
    await this.staffRepository.update(dto);
  }
}

