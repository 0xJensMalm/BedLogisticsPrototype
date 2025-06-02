export interface Patient { 
  id: string;
  name: string;
  age?: number; // Optional as per current waitingList
  priority?: 'High' | 'Medium' | 'Low'; // Optional, relevant for waiting list
  appliedDate?: string; // Optional, relevant for waiting list
  needs: string[];
  // For assigned patients
  currentBedId?: string;
  stayStartDate?: string;
  stayEndDate?: string;
  status?: 'active' | 'planned' | 'paused' | 'reserved';
}

export interface Bed {
  id: string;
  label: string; // e.g., "Bed 1", "Seng A"
  // Patients assigned to this bed will be derived dynamically or through a mapping
  // For simplicity in mock data, we might embed minimal patient stay info or just patientId
  assignedPatientId?: string; // If a patient is currently in this bed
  // Or, more robustly, stays would be a separate list linking patients to beds over time
}

export interface Room {
  id: string;
  label: string; // e.g., "Room 101", "Rom 2A"
  capabilities: string[]; // e.g., ["Hoist", "Private Bathroom", "Covid Isolation"]
  beds: Bed[];
}

export interface Department {
  id: string;
  name: string; // e.g., "Korttidsavdeling A", "Rehabiliteringsposten"
  rooms: Room[];
}

export interface Organisation {
  id: string;
  name: string; // e.g., "Voss Sjukheim", "Heimatunet Omsorgssenter"
  departments: Department[];
}

export interface Municipality {
  id: string;
  name: string; // e.g., "Voss Kommune"
  organisations: Organisation[];
}

export interface WaitingListItem extends Patient {
  priority: 'High' | 'Medium' | 'Low';
  appliedDate: string;
}
