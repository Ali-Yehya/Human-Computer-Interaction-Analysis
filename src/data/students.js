const defaultStudents = [
  { id: 1, name: "Ahmed Khan", rollNumber: "23K-0501" },
  { id: 2, name: "Fatima Rizvi", rollNumber: "23K-0502" },
  { id: 3, name: "Hassan Ali", rollNumber: "23K-0503" },
  { id: 4, name: "Ayesha Siddiqui", rollNumber: "23K-0504" },
  { id: 5, name: "Omar Farooq", rollNumber: "23K-0505" },
  { id: 6, name: "Zainab Malik", rollNumber: "23K-0506" },
  { id: 7, name: "Bilal Ahmed", rollNumber: "23K-0507" },
  { id: 8, name: "Mariam Hussain", rollNumber: "23K-0508" },
  { id: 9, name: "Usman Sheikh", rollNumber: "23K-0509" },
  { id: 10, name: "Sara Qureshi", rollNumber: "23K-0510" },
  { id: 11, name: "Hamza Iqbal", rollNumber: "23K-0511" },
  { id: 12, name: "Nadia Javed", rollNumber: "23K-0512" },
];

export function createInitialStudents() {
  const now = new Date();
  return defaultStudents.map((s) => ({
    ...s,
    engagement: "engaged",
    engagementHistory: [{ status: "engaged", timestamp: now }],
    notes: [],
    flagged: false,
    disengagedSince: null,
  }));
}

let nextId = defaultStudents.length + 1;
export function createStudent(name, rollNumber) {
  const id = nextId++;
  return {
    id,
    name,
    rollNumber,
    engagement: "engaged",
    engagementHistory: [{ status: "engaged", timestamp: new Date() }],
    notes: [],
    flagged: false,
    disengagedSince: null,
  };
}
