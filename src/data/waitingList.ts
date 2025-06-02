import { WaitingListItem } from './dataTypes';

export const waitingList: WaitingListItem[] = [
  {
    id: 'p4', // Matches Liv Johansen from allPatients, who is unassigned
    name: 'Liv Johansen',
    age: 72,
    priority: 'High',
    appliedDate: '2025-04-20',
    needs: ['Rehab Equipment', 'Physiotherapy'],
  },
  {
    id: 'p6', // Matches Erik Berg from allPatients
    name: 'Erik Berg',
    age: 65,
    priority: 'Medium',
    appliedDate: '2025-05-01',
    needs: ['Short-term Observation'],
  },
  {
    id: 'p7', // Matches Frida Lund from allPatients
    name: 'Frida Lund',
    age: 78,
    priority: 'High',
    appliedDate: '2025-05-05',
    needs: ['Post-operative Care', 'Hoist'],
  },
  {
    id: 'wl-extra1',
    name: 'Sven Ås',
    age: 81,
    priority: 'Low',
    appliedDate: '2025-05-10',
    needs: ['General Care', 'Social Interaction'],
  },
];
