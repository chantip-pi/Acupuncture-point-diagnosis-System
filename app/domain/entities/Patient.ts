export interface Patient {
  patientId: number;
  nameSurname: string;
  phoneNumber: string;
  birthday: string;
  gender: string;
  appointmentDate: string | null;
  courseCount: number;
  firstVistDate: string;
}

export class PatientEntity {
  constructor(
    public readonly patientId: number,
    public readonly nameSurname: string,
    public readonly phoneNumber: string,
    public readonly birthday: string,
    public readonly gender: string,
    public readonly appointmentDate: string | null,
    public readonly courseCount: number,
    public readonly firstVistDate: string
  ) {}

  static fromData(data: Patient): PatientEntity {
    return new PatientEntity(
      data.patientId,
      data.nameSurname,
      data.phoneNumber,
      data.birthday,
      data.gender,
      data.appointmentDate,
      data.courseCount,
      data.firstVistDate
    );
  }

  toData(): Patient {
    return {
      patientId: this.patientId,
      nameSurname: this.nameSurname,
      phoneNumber: this.phoneNumber,
      birthday: this.birthday,
      gender: this.gender,
      appointmentDate: this.appointmentDate,
      courseCount: this.courseCount,
      firstVistDate: this.firstVistDate,
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

