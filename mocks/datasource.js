const DEFAULT_DELAY_MS = 50;

let state = {
    patients: [
        { id: 'p1', name: 'Alice Tan', dob: '1988-04-12', phone: '555-0101' },
        { id: 'p2', name: 'Bob Cruz', dob: '1975-11-02', phone: '555-0202' }
    ],
    appointments: [
        { id: 'a1', patientId: 'p1', date: '2025-11-20T09:00:00Z', clinician: 'Dr. Lee', status: 'booked' },
        { id: 'a2', patientId: 'p2', date: '2025-11-21T10:30:00Z', clinician: 'Dr. Park', status: 'completed' }
    ],
    staff: [
        { id: 's1', name: 'Dr. Lee', role: 'physician' },
        { id: 's2', name: 'Nurse Joy', role: 'nurse' }
    ]
};

function delay(ms = DEFAULT_DELAY_MS) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    // For tests: reset to default data
    reset(initial = null) {
        if (initial) state = JSON.parse(JSON.stringify(initial));
        else {
            state = {
                patients: [
                    { id: 'p1', name: 'Alice Tan', dob: '1988-04-12', phone: '555-0101' },
                    { id: 'p2', name: 'Bob Cruz', dob: '1975-11-02', phone: '555-0202' }
                ],
                appointments: [
                    { id: 'a1', patientId: 'p1', date: '2025-11-20T09:00:00Z', clinician: 'Dr. Lee', status: 'booked' },
                    { id: 'a2', patientId: 'p2', date: '2025-11-21T10:30:00Z', clinician: 'Dr. Park', status: 'completed' }
                ],
                staff: [
                    { id: 's1', name: 'Dr. Lee', role: 'physician' },
                    { id: 's2', name: 'Nurse Joy', role: 'nurse' }
                ]
            };
        }
    },

    async getPatients(filter = {}) {
        await delay();
        const results = state.patients.filter(p => {
            if (filter.id && p.id !== filter.id) return false;
            if (filter.name && !p.name.toLowerCase().includes(filter.name.toLowerCase())) return false;
            return true;
        });
        return JSON.parse(JSON.stringify(results));
    },

    async getPatientById(id) {
        await delay();
        const p = state.patients.find(x => x.id === id);
        return p ? JSON.parse(JSON.stringify(p)) : null;
    },

    async createPatient(payload) {
        await delay();
        const id = `p${Date.now()}`;
        const patient = { id, ...payload };
        state.patients.push(patient);
        return JSON.parse(JSON.stringify(patient));
    },

    async updatePatient(id, patch) {
        await delay();
        const idx = state.patients.findIndex(x => x.id === id);
        if (idx === -1) return null;
        state.patients[idx] = { ...state.patients[idx], ...patch };
        return JSON.parse(JSON.stringify(state.patients[idx]));
    },

    async getAppointments(filter = {}) {
        await delay();
        const results = state.appointments.filter(a => {
            if (filter.id && a.id !== filter.id) return false;
            if (filter.patientId && a.patientId !== filter.patientId) return false;
            if (filter.status && a.status !== filter.status) return false;
            return true;
        });
        return JSON.parse(JSON.stringify(results));
    },

    async createAppointment(payload) {
        await delay();
        const id = `a${Date.now()}`;
        const appt = { id, ...payload };
        state.appointments.push(appt);
        return JSON.parse(JSON.stringify(appt));
    },

    async updateAppointment(id, patch) {
        await delay();
        const idx = state.appointments.findIndex(x => x.id === id);
        if (idx === -1) return null;
        state.appointments[idx] = { ...state.appointments[idx], ...patch };
        return JSON.parse(JSON.stringify(state.appointments[idx]));
    },

    async getStaff() {
        await delay();
        return JSON.parse(JSON.stringify(state.staff));
    },

    // helper to inspect internal state (for debugging/tests)
    inspect() {
        return JSON.parse(JSON.stringify(state));
    }
};