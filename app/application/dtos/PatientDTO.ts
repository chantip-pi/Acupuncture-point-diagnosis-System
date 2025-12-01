export interface CreatePatientDTO {
  nameSurname: string;
  phoneNumber: string;
  birthday: string;
  gender: string;
  appointmentDate: string;
  courseCount: number;
  firstVistDate: string;
}

export interface UpdatePatientDTO {
  patientId: number;
  nameSurname: string;
  phoneNumber: string;
  birthday: string;
  gender: string;
  appointmentDate: string | null;
  courseCount: number;
  firstVistDate: string;
}

