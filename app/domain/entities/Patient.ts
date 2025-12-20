export interface Patient {
  patientId: number;
  nameSurname: string;
  phoneNumber: string;
  birthday: string;
  gender: string;
  remainingCourse: number;
  congenitalDisease: string;
  surgeryHistory: string;
}

export class PatientEntity {
  constructor(
    public readonly patientId: number,
    public readonly nameSurname: string,
    public readonly phoneNumber: string,
    public readonly birthday: string,
    public readonly gender: string,
    public readonly remainingCourse: number,
    public readonly congenitalDisease: string,
    public readonly surgeryHistory: string,
  ) {}

  static fromData(data: Patient): PatientEntity {
    return new PatientEntity(
      data.patientId,
      data.nameSurname,
      data.phoneNumber,
      data.birthday,
      data.gender,
      data.remainingCourse,
      data.congenitalDisease,
      data.surgeryHistory,
    );
  }

  toData(): Patient {
    return {
      patientId: this.patientId,
      nameSurname: this.nameSurname,
      phoneNumber: this.phoneNumber,
      birthday: this.birthday,
      gender: this.gender,
      remainingCourse: this.remainingCourse,
      congenitalDisease: this.congenitalDisease,
      surgeryHistory: this.surgeryHistory,
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

