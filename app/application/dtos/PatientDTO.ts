export interface CreatePatientDTO {
  name_surname: string;
  phone_number: string;
  birthday: string;
  gender: string;
  appointment_date: string;
  course_count: number;
  first_visit_date: string;
}

export interface UpdatePatientDTO {
  patient_id: number;
  name_surname: string;
  phone_number: string;
  birthday: string;
  gender: string;
  appointment_date: string | null;
  course_count: number;
  first_visit_date: string;
}

