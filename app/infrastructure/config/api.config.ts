export const API_CONFIG = {
  baseUrl: "https://dinosaur.prakasitj.com",
  endpoints: {
    patient: {
      list: "/patient/getPatientList",
      getById: (id: number) => `/patient/searchbyID/${id}`,
      getByAppointmentDate: (date: string) => `/patient/searchbyAppointmentDate/${date}`,
      create: "/patient/addPatient",
      update: "/patient/editPatient",
    },
    staff: {
      list: "/staff/getStaffList",
      getById: (id: number) => `/staff/searchbyID/${id}`,
      getByUsername: (username: string) => `/staff/searchbyUsername/${username}`,
      login: (username: string, password: string) => `/staff/login/${username}/${password}`,
      create: "/staff/addStaff",
      update: "/staff/editStaff",
    },
  },
};

