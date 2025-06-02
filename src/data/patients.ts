import { Patient } from './dataTypes';
import { vossMunicipality } from './municipalityData'; // Import updated municipality data

// Helper function to add days to a date
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Helper function to format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Configuration
const MOCK_CURRENT_DATE = new Date('2025-06-02T12:00:00.000Z'); // Current date for status logic
const PLANNED_STATUS_CUTOFF_DATE = new Date('2025-06-04T00:00:00.000Z');
const PERIOD_START_DATE = new Date('2025-05-15T00:00:00.000Z');
const PERIOD_END_DATE = new Date('2025-07-15T00:00:00.000Z');
const MIN_STAY_DAYS = 5;
const MAX_STAY_DAYS = 20;
const GAP_DAYS_BETWEEN_STAYS = 1;

const patientNames = [
  'Liam Hansen', 'Olivia Johansen', 'Noah Andersen', 'Emma Larsen', 'Lucas Nilsen', 'Sofie Pedersen',
  'Isak Kristiansen', 'Emilie Olsen', 'Filip Jensen', 'Nora Berg', 'Jakob Pettersen', 'Ingrid Eriksen',
  'William Martinsen', 'Maja Solberg', 'Aksel Hagen', 'Leah Knudsen', 'Oskar Fredriksen', 'Hedda Andreassen',
  'Theodor Svendsen', 'Ella Holmen', 'Elias Dahl', 'Selma Lien', 'Mathias Berntsen', 'Frida Aasen',
  'Johannes Haugen', 'Aurora Bakke', 'Henrik Strøm', 'Ida Halvorsen', 'Victor Lund', 'Sara Nygård',
  'Tobias Iversen', 'Amalie Jørgensen', 'Magnus Antonsen', 'Hanna Rasmussen', 'Sander Thorsen', 'Marie Madsen',
  'Kasper Moen', 'Tuva Paulsen', 'Adam Eide', 'Linnea Gustavsen', 'Mikkel Johnsen', 'Vilde Danielsen',
  'Daniel Larsen', 'Sofia Kristoffersen', 'Jonas Hansen', 'Astrid Olsen', 'Markus Berg', 'Tiril Pedersen'
];

const patientNeedsPool = [
  'Post-operative care', 'Medication management', 'Wound dressing', 'Mobilization assistance',
  'Pain management', 'Physical therapy', 'Occupational therapy', 'Nutritional support',
  'Respiratory care', 'Diabetes management', 'Cognitive support', 'Emotional support',
  'Fall prevention', 'Hygiene assistance', 'Speech therapy', 'IV therapy'
];

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

let patientIdCounter = 1;
const generatedPatients: Patient[] = [];

vossMunicipality.organisations.forEach(org => {
  org.departments.forEach(dept => {
    dept.rooms.forEach(room => {
      room.beds.forEach(bed => {
        let currentBedDate = new Date(PERIOD_START_DATE);

        while (currentBedDate < PERIOD_END_DATE) {
          const stayDuration = getRandomInt(MIN_STAY_DAYS, MAX_STAY_DAYS);
          const stayStartDate = new Date(currentBedDate);
          const stayEndDate = addDays(stayStartDate, stayDuration -1); // -1 because duration includes start day

          if (stayEndDate >= PERIOD_END_DATE) break; // Don't schedule if stay extends beyond period

          const patientName = getRandomElement(patientNames);
          const numNeeds = getRandomInt(1, 3);
          const patientNeeds: string[] = [];
          for (let i = 0; i < numNeeds; i++) {
            let need = getRandomElement(patientNeedsPool);
            while(patientNeeds.includes(need)) { // Ensure unique needs
                need = getRandomElement(patientNeedsPool);
            }
            patientNeeds.push(need);
          }
          
          const status: 'active' | 'planned' = stayStartDate < PLANNED_STATUS_CUTOFF_DATE ? 'active' : 'planned';

          generatedPatients.push({
            id: `p${patientIdCounter++}`,
            name: patientName,
            needs: patientNeeds,
            currentBedId: bed.id,
            stayStartDate: formatDate(stayStartDate),
            stayEndDate: formatDate(stayEndDate),
            status: status,
          });

          currentBedDate = addDays(stayEndDate, 1 + GAP_DAYS_BETWEEN_STAYS); // Next stay starts after gap
        }
      });
    });
  });
});

export const allPatients: Patient[] = generatedPatients;