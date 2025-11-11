export interface Patient {
  patient_id: number;
  name_surname: string;
  phone_number: string;
  birthday: string;
  gender: string;
  appointment_date: string | null;
  course_count: number;
  first_visit_date: string;
}

export class PatientEntity {
  constructor(
    public readonly patient_id: number,
    public readonly name_surname: string,
    public readonly phone_number: string,
    public readonly birthday: string,
    public readonly gender: string,
    public readonly appointment_date: string | null,
    public readonly course_count: number,
    public readonly first_visit_date: string
  ) {}

  static fromData(data: Patient): PatientEntity {
    return new PatientEntity(
      data.patient_id,
      data.name_surname,
      data.phone_number,
      data.birthday,
      data.gender,
      data.appointment_date,
      data.course_count,
      data.first_visit_date
    );
  }

  toData(): Patient {
    return {
      patient_id: this.patient_id,
      name_surname: this.name_surname,
      phone_number: this.phone_number,
      birthday: this.birthday,
      gender: this.gender,
      appointment_date: this.appointment_date,
      course_count: this.course_count,
      first_visit_date: this.first_visit_date,
    };
  }

  calculateAge(): number {
    const birthDate = new Date(this.birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }

    return age;
  }
}

