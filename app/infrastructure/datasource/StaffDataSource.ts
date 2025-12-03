import { Staff } from "~/domain/entities/Staff";

export class StaffDataSource {
  constructor(private readonly baseUrl: string = "http://localhost:3000/api/staff") {}

  private async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Request failed: ${res.status} ${res.statusText} ${text}`);
    }
    return (await res.json()) as T;
  }

  async getAll(): Promise<Staff[]> {
    const res = await fetch(this.baseUrl, { method: "GET" });
    return this.handleResponse<Staff[]>(res);
  }

  async getById(staffId: number): Promise<Staff | null> {
    const res = await fetch(`${this.baseUrl}/${staffId}`, { method: "GET" });
    if (res.status === 404) return null;
    return this.handleResponse<Staff>(res);
  }

    async getByUsername(username: string): Promise<Staff | null> {
    const res = await fetch(`${this.baseUrl}/username/${username}`, { method: "GET" });
    if (res.status === 404) return null;
    return this.handleResponse<Staff>(res);
  }


  async create(staff: Omit<Staff, "staffId">): Promise<Staff> {
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(staff),
    });
    return this.handleResponse<Staff>(res);
  }

  async update(staff: Staff): Promise<Staff> {
    const res = await fetch(`${this.baseUrl}/${staff.staffId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(staff),
    });
    return this.handleResponse<Staff>(res);
  }

  async delete(staffId: number): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${staffId}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Delete failed: ${res.status} ${res.statusText}`);
  }
}

// optional default instance
export const staffDatasource = new StaffDataSource();