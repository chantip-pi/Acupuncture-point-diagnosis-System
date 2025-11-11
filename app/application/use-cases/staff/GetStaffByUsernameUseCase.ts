import { IStaffRepository } from "~/domain/repositories/IStaffRepository";
import { Staff } from "~/domain/entities/Staff";

export class GetStaffByUsernameUseCase {
  constructor(private readonly staffRepository: IStaffRepository) {}

  async execute(username: string): Promise<Staff | null> {
    return await this.staffRepository.getByUsername(username);
  }
}

