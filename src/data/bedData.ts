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
}




import beds from './beds.json';
import patients from './patients.json';

// Group beds by roomId
const roomsMap: Record<string, { id: string; label: string; beds: any[] }> = {};
beds.forEach(bed => {
  if (!roomsMap[bed.roomId]) {
    roomsMap[bed.roomId] = {
      id: bed.roomId,
      label: `Room ${bed.roomId}`,
      beds: [],
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

