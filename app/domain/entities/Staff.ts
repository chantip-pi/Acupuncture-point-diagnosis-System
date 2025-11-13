export interface Staff {
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

export class StaffEntity {
  constructor(
    public readonly staff_id: number,
    public readonly username: string,
    public readonly password: string,
    public readonly name_surname: string,
    public readonly staff_phone_number: string,
    public readonly birthday: string,
    public readonly gender: string,
    public readonly email: string,
    public readonly role: string
  ) {}

  static fromData(data: Staff): StaffEntity {
    return new StaffEntity(
      data.staff_id,
      data.username,
      data.password,
      data.name_surname,
      data.staff_phone_number,
      data.birthday,
      data.gender,
      data.email,
      data.role
    );
  }

  toData(): Staff {
    return {
      staff_id: this.staff_id,
      username: this.username,
      password: this.password,
      name_surname: this.name_surname,
      staff_phone_number: this.staff_phone_number,
      birthday: this.birthday,
      gender: this.gender,
      email: this.email,
      role: this.role,
    };
  }
}

