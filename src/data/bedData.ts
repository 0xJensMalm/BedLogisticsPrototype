export type PatientStatus = 'active' | 'paused' | 'planned';

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

export const rooms: Room[] = [
  {
    id: '101',
    label: 'Room 101',
    beds: [
      {
        id: '101-1',
        label: 'Bed 1',
        patients: [
          {
            id: 'p1',
            name: 'Ola Nordmann',
            status: 'active',
            inDate: '2025-05-18',
            outDate: '2025-05-28',
            needs: 'Rehab',
          },
        ],
      },
      {
        id: '101-2',
        label: 'Bed 2',
        patients: [
          {
            id: 'p2',
            name: 'Kari Nordmann',
            status: 'planned',
            inDate: '2025-05-29',
            outDate: '2025-06-10',
            needs: 'Observation',
          },
        ],
      },
    ],
  },
  {
    id: '102',
    label: 'Room 102',
    beds: [
      {
        id: '102-1',
        label: 'Bed 1',
        patients: [
          {
            id: 'p3',
            name: 'Per Hansen',
            status: 'paused',
            inDate: '2025-05-20',
            outDate: '2025-05-25',
            needs: 'Long-term',
          },
        ],
      },
    ],
  },
  {
    id: '103',
    label: 'Room 103',
    beds: [
      {
        id: '103-1',
        label: 'Bed 1',
        patients: [],
      },
      {
        id: '103-2',
        label: 'Bed 2',
        patients: [],
      },
    ],
  },
  {
    id: '104',
    label: 'Room 104',
    beds: [
      {
        id: '104-1',
        label: 'Bed 1',
        patients: [
          {
            id: 'p4',
            name: 'Liv Johansen',
            status: 'active',
            inDate: '2025-05-19',
            outDate: '2025-05-23',
            needs: 'Short-term',
          },
        ],
      },
    ],
  },
  {
    id: '105',
    label: 'Room 105',
    beds: [
      {
        id: '105-1',
        label: 'Bed 1',
        patients: [],
      },
      {
        id: '105-2',
        label: 'Bed 2',
        patients: [
          {
            id: 'p5',
            name: 'Anne Olsen',
            status: 'planned',
            inDate: '2025-06-01',
            outDate: '2025-06-15',
            needs: 'Observation',
          },
        ],
      },
    ],
  },
  {
    id: '106',
    label: 'Room 106',
    beds: [
      {
        id: '106-1',
        label: 'Bed 1',
        patients: [
          {
            id: 'p6',
            name: 'Erik Berg',
            status: 'paused',
            inDate: '2025-05-15',
            outDate: '2025-05-21',
            needs: 'Recovery',
          },
        ],
      },
    ],
  },
];

