import { Staff } from "../entities/Staff";

export interface IStaffRepository {
  getAll(): Promise<Staff[]>;
  getById(id: number): Promise<Staff | null>;
  getByUsername(username: string): Promise<Staff | null>;
  login(username: string, password: string): Promise<Staff | null>;
  create(staff: Omit<Staff, "staffId">): Promise<Staff>;
  update(staff: Staff): Promise<Staff>;
}

