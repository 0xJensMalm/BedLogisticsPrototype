import { Municipality } from './dataTypes';

export const vossMunicipality: Municipality = {
  id: 'voss-kommune',
  name: 'Voss Kommune',
  organisations: [
    {
      id: 'org-voss-sjukheim',
      name: 'Voss Sjukheim',
      departments: [
        {
          id: 'dep-vs-korttid-a',
          name: 'Korttidsavdeling A',
          rooms: [
            {
              id: 'room-vs-ka-101',
              label: 'Rom 101',
              capabilities: ['Hoist', 'Private Bathroom'],
              beds: [
                { id: 'bed-vs-ka-101-1', label: 'Seng 1' },
                { id: 'bed-vs-ka-101-2', label: 'Seng 2' },
              ],
            },
            {
              id: 'room-vs-ka-102',
              label: 'Rom 102',
              capabilities: ['Oxygen Supply'],
              beds: [{ id: 'bed-vs-ka-102-1', label: 'Seng 1' }],
            },
            {
              id: 'room-vs-ka-103',
              label: 'Rom 103',
              capabilities: ['Standard Care', 'Fall Prevention Mat'],
              beds: [
                { id: 'bed-vs-ka-103-1', label: 'Seng 1' },
                { id: 'bed-vs-ka-103-2', label: 'Seng 2' },
              ],
            },
            {
              id: 'room-vs-ka-104',
              label: 'Rom 104',
              capabilities: ['Hoist'],
              beds: [{ id: 'bed-vs-ka-104-1', label: 'Seng 1' }],
            },
            {
              id: 'room-vs-ka-105',
              label: 'Rom 105',
              capabilities: ['Private Bathroom', 'TV'],
              beds: [
                { id: 'bed-vs-ka-105-1', label: 'Seng 1' },
                { id: 'bed-vs-ka-105-2', label: 'Seng 2' },
              ],
            },
          ],
        },
        {
          id: 'dep-vs-langtid-b',
          name: 'Langtidsavdeling B',
          rooms: [
            {
              id: 'room-vs-lb-201',
              label: 'Rom 201',
              capabilities: ['Wheelchair Access'],
              beds: [
                { id: 'bed-vs-lb-201-1', label: 'Seng 1' },
                { id: 'bed-vs-lb-201-2', label: 'Seng 2' },
              ],
            },
            {
              id: 'room-vs-lb-202',
              label: 'Rom 202',
              capabilities: ['Palliative Care', 'Family Area'],
              beds: [{ id: 'bed-vs-lb-202-1', label: 'Seng 1' }],
            },
            {
              id: 'room-vs-lb-203',
              label: 'Rom 203',
              capabilities: ['Dementia Care', 'Secure Window'],
              beds: [{ id: 'bed-vs-lb-203-1', label: 'Seng 1' }],
            },
            {
              id: 'room-vs-lb-204',
              label: 'Rom 204',
              capabilities: ['Wheelchair Access', 'Quiet Room'],
              beds: [{ id: 'bed-vs-lb-204-1', label: 'Seng 1' }],
            },
            {
              id: 'room-vs-lb-205',
              label: 'Rom 205',
              capabilities: ['Palliative Care Support', 'View'],
              beds: [{ id: 'bed-vs-lb-205-1', label: 'Seng 1' }],
            },
          ],
        },
      ],
    },
    {
      id: 'org-heimatunet',
      name: 'Heimatunet Omsorgssenter',
      departments: [
        {
          id: 'dep-ht-rehab',
          name: 'Rehabiliteringsposten',
          rooms: [
            {
              id: 'room-ht-rh-301',
              label: 'Rom 301',
              capabilities: ['Rehab Equipment', 'Large Room'],
              beds: [{ id: 'bed-ht-rh-301-1', label: 'Seng 1' }],
            },
            {
              id: 'room-ht-rh-302',
              label: 'Rom 302',
              capabilities: ['Quiet Environment'],
              beds: [{ id: 'bed-ht-rh-302-1', label: 'Seng 1' }],
            },
            {
              id: 'room-ht-rh-303',
              label: 'Rom 303',
              capabilities: ['Speech Therapy Access', 'Adjustable Bed'],
              beds: [
                { id: 'bed-ht-rh-303-1', label: 'Seng 1' },
                { id: 'bed-ht-rh-303-2', label: 'Seng 2' },
              ],
            },
            {
              id: 'room-ht-rh-304',
              label: 'Rom 304',
              capabilities: ['Rehab Equipment', 'Natural Light'],
              beds: [
                { id: 'bed-ht-rh-304-1', label: 'Seng 1' },
                { id: 'bed-ht-rh-304-2', label: 'Seng 2' },
              ],
            },
            {
              id: 'room-ht-rh-305',
              label: 'Rom 305',
              capabilities: ['Occupational Therapy Access', 'Wi-Fi'],
              beds: [{ id: 'bed-ht-rh-305-1', label: 'Seng 1' }],
            },
          ],
        },
      ],
    },
  ],
};