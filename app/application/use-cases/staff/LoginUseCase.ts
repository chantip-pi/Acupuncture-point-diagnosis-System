import { IStaffRepository } from "~/domain/repositories/IStaffRepository";
import { LoginDTO } from "~/application/dtos/StaffDTO";
import { Staff } from "~/domain/entities/Staff";

export class LoginUseCase {
  constructor(private readonly staffRepository: IStaffRepository) {}

  async execute(dto: LoginDTO): Promise<Staff | null> {
    console.log("[LoginUseCase.execute] dto", {
      username: dto.username,
      passwordLength: dto.password.length,
    });

    const staff = await this.staffRepository.login(dto.username, dto.password);

    console.log("[LoginUseCase.execute] staff found", {
      hasStaff: !!staff,
    });

    return staff;
  }
}

