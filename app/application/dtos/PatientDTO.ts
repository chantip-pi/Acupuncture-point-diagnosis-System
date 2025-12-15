export interface CreatePatientDTO {
  nameSurname: string;
  phoneNumber: string;
  birthday: string;
  gender: string;
  remainingCourse: number;
}

export interface UpdatePatientDTO {
  patientId: number;
  nameSurname: string;
  phoneNumber: string;
  birthday: string;
  gender: string;
  remainingCourse: number;
}

