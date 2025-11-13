export interface LoginDTO {
  username: string;
  password: string;
}

export interface CreateStaffDTO {
  username: string;
  password: string;
  name_surname: string;
  staff_phone_number: string;
  birthday: string;
  gender: string;
  email: string;
  role: string;
}

export interface UpdateStaffDTO {
  staff_id: number;
  username: string;
  password: string;
  name_surname: string;
  staff_phone_number: string;
  birthday: string;
  gender: string;
  email: string;
  role: string;
}

