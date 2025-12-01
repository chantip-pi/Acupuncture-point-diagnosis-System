import { IStaffRepository } from "~/domain/repositories/IStaffRepository";
import { Staff } from "~/domain/entities/Staff";
import { HttpClient } from "../http/HttpClient";
import { API_CONFIG } from "../config/api.config";

export class StaffRepository implements IStaffRepository {
  constructor(private readonly httpClient: HttpClient) {}

  async getAll(): Promise<Staff[]> {
    const data = await this.httpClient.get<Staff[]>(API_CONFIG.endpoints.staff.list);
    return Array.isArray(data) ? data : [];
  }

  async getById(id: number): Promise<Staff | null> {
    const data = await this.httpClient.get<Staff[]>(API_CONFIG.endpoints.staff.getById(id));
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  }

  async getByUsername(username: string): Promise<Staff | null> {
    const data = await this.httpClient.get<Staff[]>(
      API_CONFIG.endpoints.staff.getByUsername(username)
    );
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  }

  async login(username: string, password: string): Promise<Staff | null> {
    const data = await this.httpClient.get<Staff[]>(
      API_CONFIG.endpoints.staff.login(username, password)
    );
    return Array.isArray(data) && data.length > 0 && data[0].staffId ? data[0] : null;
  }

  async create(staff: Omit<Staff, "staffId">): Promise<Staff> {
    const data = await this.httpClient.post<Staff>(
      API_CONFIG.endpoints.staff.create,
      staff
    );
    return data;
  }

  async update(staff: Staff): Promise<Staff> {
    const data = await this.httpClient.post<Staff>(
      API_CONFIG.endpoints.staff.update,
      staff
    );
    return data;
  }
}

