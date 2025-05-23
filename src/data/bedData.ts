import beds from './beds.json';
import patients from './patients.json';

// Define room-specific capabilities here for easy editing
const roomSpecificCapabilities: Record<string, string[]> = {
  '101': ['Acute Care', 'Ceiling Hoist'], 
  '102': ['Isolation Room'],             
  '103': [],
  '104': [],
  '105': ['Catheter'],                   
  '106': ['Catheter'],                   
  // Add more rooms and their capabilities like this:
  // '104': ['Bariatric Bed', 'Hoist Available'],
  // '105': ['Telemetry', 'Post-Op Recovery'],
};

const defaultCapabilities: string[] = ['Short-term Room'];

export type PatientStatus = 'active' | 'paused' | 'planned' | 'reserved';

export interface Patient {
  id: string;
  name: string;
  status: PatientStatus;
  inDate: string; // ISO date
  outDate: string; // ISO date
  needs: string;
}

export interface Bed {
  id: string;
  label: string; // e.g. 'Room 101 - Bed 1'
  patients: Patient[]; // Only one patient at a time, but keep as array for history/robustness
}

export interface Room {
  id: string;
  label: string;
  beds: Bed[];
  capabilities: string[];
}

// Group beds by roomId
const roomsMap: Record<string, { id: string; label: string; beds: any[]; capabilities: string[] }> = {};
beds.forEach(bed => {
  if (!roomsMap[bed.roomId]) {
    roomsMap[bed.roomId] = {
      id: bed.roomId,
      label: `Room ${bed.roomId}`,
      beds: [],
      // Assign capabilities from the lookup object, or use default
      capabilities: roomSpecificCapabilities[bed.roomId] || defaultCapabilities,
    };
  }
  // Attach patients sorted by inDate
  const bedPatients = patients
    .filter(p => p.bedId === bed.id)
    .sort((a, b) => a.inDate.localeCompare(b.inDate));
  roomsMap[bed.roomId].beds.push({
    id: bed.id,
    label: bed.label,
    patients: bedPatients,
  });
});

export const rooms: Room[] = Object.values(roomsMap);
