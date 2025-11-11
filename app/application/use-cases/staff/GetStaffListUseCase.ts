import { IStaffRepository } from "~/domain/repositories/IStaffRepository";
import { Staff } from "~/domain/entities/Staff";

export class GetStaffListUseCase {
  constructor(private readonly staffRepository: IStaffRepository) {}

  async execute(): Promise<Staff[]> {
    return await this.staffRepository.getAll();
  }
}

