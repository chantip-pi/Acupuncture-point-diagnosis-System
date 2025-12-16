import { IStaffRepository } from "~/domain/repositories/IStaffRepository";

export class DeleteStaffUseCase {
  constructor(private readonly staffRepository: IStaffRepository) {}

   async execute(staffId: number): Promise<void> {
    return await this.staffRepository.delete(staffId);
  }
}