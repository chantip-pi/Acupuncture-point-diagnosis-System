import { IStaffRepository } from "~/domain/repositories/IStaffRepository";
import { Staff } from "~/domain/entities/Staff";
import { MockDataSource } from "../datasource/MockDataSource";

/**
 * Mock implementation of StaffRepository using in-memory datasource.
 * This can be easily swapped with the real StaffRepository.
 */
export class MockStaffRepository implements IStaffRepository {
  constructor(private readonly dataSource: MockDataSource) {}

  async getAll(): Promise<Staff[]> {
    return this.dataSource.getAllStaff();
  }

  async getById(id: number): Promise<Staff | null> {
    return this.dataSource.getStaffById(id);
  }

  async getByUsername(username: string): Promise<Staff | null> {
    return this.dataSource.getStaffByUsername(username);
  }

  async login(username: string, password: string): Promise<Staff | null> {
    return this.dataSource.login(username, password);
  }

  async create(staff: Omit<Staff, "staffId">): Promise<Staff> {
    return this.dataSource.createStaff(staff);
  }

  async update(staff: Staff): Promise<Staff> {
    return this.dataSource.updateStaff(staff);
  }
}

