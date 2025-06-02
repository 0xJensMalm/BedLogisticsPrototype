import React, { useMemo, useState } from 'react';
import { vossMunicipality } from '../data/municipalityData';
import { WaitingListItem } from '../data/dataTypes';
import { allPatients } from '../data/patients';
import { waitingList } from '../data/waitingList';
import styles from './AdministrativeView.module.css';
import { Organisation, Department, Room as RoomType, Bed as BedType, Patient as PatientType, Municipality } from '../data/dataTypes'; // Corrected path, removed PatientStatus
import GanttChart from '../components/GanttChart'; // Corrected path
import TimeRangeToggle from '../components/TimeRangeToggle';

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

// Helper function to calculate waiting days
const calculateWaitingDays = (appliedDateStr: string, currentDateStr: string): number => {
  const appliedDate = new Date(appliedDateStr);
  const currentDate = new Date(currentDateStr);
  const diffTime = Math.abs(currentDate.getTime() - appliedDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

interface MunicipalityStats {
  totalOrganisations: number;
  totalDepartments: number;
  totalRooms: number;
  totalBeds: number;
  assignedPatients: number; // Active assigned patients
  occupancyRate: string; // Percentage string
  occupancyNumeric: number; // Raw numeric value for progress bar
  vacancyRate: string; // Percentage string
  patientsOnWaitingList: number;
}

interface OrganisationStat {
  id: string;
  name: string;
  totalBeds: number;
  occupiedBeds: number;
  occupancyRate: string;
  vacancyRate: string;
  totalDepartments: number;
  totalRooms: number;
}

// Structure for GanttChart component's roomsData prop
interface GanttRoom extends Omit<RoomType, 'beds'> {
  beds: Array<Omit<BedType, 'assignedPatientId'> & { patients: PatientType[] }>;
}

interface DepartmentGanttData {
  id: string;
  name: string;
  roomsData: GanttRoom[];
}

interface OrganisationGanttData {
  id: string;
  name: string;
  departments: DepartmentGanttData[];
}

const AdministrativeView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const [startDate] = useState<Date>(new Date('2025-05-01')); // Fixed demo date
  const [expandedOrganisations, setExpandedOrganisations] = useState<Record<string, boolean>>({});
  const MOCK_CURRENT_DATE_STR = '2025-06-02';

  const municipalityOverallStats: MunicipalityStats = useMemo(() => {
    const currentMunicipality: Municipality = vossMunicipality;
    const allPatientsFromData: PatientType[] = allPatients;
    const waitingListFromData = waitingList;

    let bedCount = 0;
    let roomCount = 0;
    let deptCount = 0;
    let assignedPatientCount = 0;

    currentMunicipality.organisations.forEach((org: Organisation) => {
      deptCount += org.departments.length;
      org.departments.forEach((dept: Department) => {
        roomCount += dept.rooms.length;
        dept.rooms.forEach((room: RoomType) => { // Corrected type: Room -> RoomType
          bedCount += room.beds.length;
          room.beds.forEach((bed: BedType) => { // Corrected type: Bed -> BedType
            const patientAssignedToBed = allPatientsFromData.find((p: PatientType) => p.currentBedId === bed.id && (p.status === 'active' || p.status === 'planned'));
            if (patientAssignedToBed) {
              assignedPatientCount++;
            }
          });
        });
      });
    });

    const rawOccupancyPercent = bedCount > 0 ? (assignedPatientCount / bedCount) * 100 : 0;
    const occupancyRateStr = rawOccupancyPercent.toFixed(1) + '%';
    const occupancyNumericForBar = Math.min(rawOccupancyPercent, 100); // Cap for progress bar
    const vacancyRateStr = (bedCount > 0 ? Math.max(0, 100 - rawOccupancyPercent) : 0).toFixed(1) + '%';

    return {
      totalOrganisations: currentMunicipality.organisations.length,
      totalDepartments: deptCount,
      totalRooms: roomCount,
      totalBeds: bedCount,
      assignedPatients: assignedPatientCount,
      occupancyRate: occupancyRateStr,
      occupancyNumeric: occupancyNumericForBar,
      vacancyRate: vacancyRateStr,
      patientsOnWaitingList: waitingListFromData.length,
    };
  }, []);

  const organisationDetailedStats: OrganisationStat[] = useMemo(() => {
    return vossMunicipality.organisations.map((org: Organisation) => {
      let orgBedCount = 0;
      let orgAssignedPatientCount = 0;
      let orgRoomCount = 0;

      org.departments.forEach((dept: Department) => {
        orgRoomCount += dept.rooms.length;
        dept.rooms.forEach((room: RoomType) => { 
          orgBedCount += room.beds.length;
          room.beds.forEach((bed: BedType) => { 
            const patientAssignedToBed = allPatients.find((p: PatientType) => p.currentBedId === bed.id && (p.status === 'active' || p.status === 'planned'));
            if (patientAssignedToBed) {
              orgAssignedPatientCount++;
            }
          });
        });
      });
      
      const orgOccupancy = orgBedCount > 0 ? (orgAssignedPatientCount / orgBedCount) * 100 : 0;
      const orgOccupancyStr = orgBedCount > 0 ? orgOccupancy.toFixed(1) + '%' : 'N/A';
      const orgVacancyStr = orgBedCount > 0 ? (Math.max(0, 100 - orgOccupancy)).toFixed(1) + '%' : 'N/A'; // Ensure vacancy is not negative

      return {
        id: org.id,
        name: org.name,
        totalBeds: orgBedCount, // Corrected variable
        occupiedBeds: orgAssignedPatientCount, // Corrected variable
        occupancyRate: orgOccupancyStr,
        vacancyRate: orgVacancyStr,
        totalDepartments: org.departments.length,
        totalRooms: orgRoomCount, // Corrected variable
      };
    });
  }, []);


  interface SuggestedVacancy {
    id: string;
    organisationName: string;
    departmentName: string;
    roomLabel: string;
    bedLabel: string;
    availabilityStatus: string; // 'Available Now' or 'Available Soon'
    availabilityDate?: string; // YYYY-MM-DD, if 'Available Soon'
    color: 'green' | 'yellow';
  }

  const processedWaitingList = useMemo(() => {
    return waitingList
      .map(item => ({
        ...item,
        waitingDays: calculateWaitingDays(item.appliedDate, MOCK_CURRENT_DATE_STR),
      }))
      .sort((a, b) => {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return b.waitingDays - a.waitingDays;
      })
      .slice(0, 20); // Show 20 patients
  }, [waitingList, MOCK_CURRENT_DATE_STR]);

  const suggestedVacancies = useMemo(() => {
    const allAvailableNow: SuggestedVacancy[] = [];
    const allAvailableSoon: SuggestedVacancy[] = [];
    const currentMockDate = new Date(MOCK_CURRENT_DATE_STR);

    vossMunicipality.organisations.forEach(org => {
      org.departments.forEach(dept => {
        dept.rooms.forEach(room => {
          room.beds.forEach(bed => {
            const assignedPatient = allPatients.find(
              p => p.currentBedId === bed.id && (p.status === 'active' || p.status === 'planned')
            );

            if (!assignedPatient || !assignedPatient.stayEndDate) {
              allAvailableNow.push({
                id: `${org.id}-${dept.id}-${room.id}-${bed.id}-now`,
                organisationName: org.name,
                departmentName: dept.name,
                roomLabel: room.label,
                bedLabel: bed.label,
                availabilityStatus: 'Available Now',
                color: 'green',
              });
            } else {
              const patientEndDate = new Date(assignedPatient.stayEndDate);
              if (patientEndDate < currentMockDate) { // Already ended
                allAvailableNow.push({
                  id: `${org.id}-${dept.id}-${room.id}-${bed.id}-ended`,
                  organisationName: org.name,
                  departmentName: dept.name,
                  roomLabel: room.label,
                  bedLabel: bed.label,
                  availabilityStatus: 'Available Now',
                  color: 'green',
                });
              } else {
                const daysUntilEnd = (patientEndDate.getTime() - currentMockDate.getTime()) / (1000 * 60 * 60 * 24);
                if (daysUntilEnd >= 0 && daysUntilEnd <= 2) { 
                  allAvailableSoon.push({
                    id: `${org.id}-${dept.id}-${room.id}-${bed.id}-soon`,
                    organisationName: org.name,
                    departmentName: dept.name,
                    roomLabel: room.label,
                    bedLabel: bed.label,
                    availabilityStatus: `Available from ${formatDate(addDays(patientEndDate, 1))}`,
                    availabilityDate: formatDate(addDays(patientEndDate, 1)),
                    color: 'yellow',
                  });
                }
              }
            }
          });
        });
      });
    });

    // Sort within categories before slicing
    const sortFn = (a: SuggestedVacancy, b: SuggestedVacancy) => {
      if (a.availabilityDate && b.availabilityDate) {
        const dateComparison = new Date(a.availabilityDate).getTime() - new Date(b.availabilityDate).getTime();
        if (dateComparison !== 0) return dateComparison;
      }
      const orgComp = a.organisationName.localeCompare(b.organisationName);
      if (orgComp !== 0) return orgComp;
      const deptComp = a.departmentName.localeCompare(b.departmentName);
      if (deptComp !== 0) return deptComp;
      const roomComp = a.roomLabel.localeCompare(b.roomLabel);
      if (roomComp !== 0) return roomComp;
      return a.bedLabel.localeCompare(b.bedLabel);
    };

    allAvailableNow.sort(sortFn);
    allAvailableSoon.sort(sortFn);

    const finalVacancies: SuggestedVacancy[] = [];
    finalVacancies.push(...allAvailableNow.slice(0, 3));
    finalVacancies.push(...allAvailableSoon.slice(0, 9));
    
    // Final sort to ensure green are first if any available soon were pushed before available now (e.g. if less than 3 'now' spots)
    return finalVacancies.sort((a,b) => {
      if (a.color === 'green' && b.color === 'yellow') return -1;
      if (a.color === 'yellow' && b.color === 'green') return 1;
      return sortFn(a,b); // Use the detailed sort for items of the same color
    });

  }, [vossMunicipality, allPatients, MOCK_CURRENT_DATE_STR]);

  const municipalityGanttData: OrganisationGanttData[] = useMemo(() => {
    return vossMunicipality.organisations.map(org => {
      const departmentsData: DepartmentGanttData[] = org.departments.map(dept => {
        const roomsGantt: GanttRoom[] = dept.rooms.map(room => {
          const bedsWithPatients: GanttRoom['beds'][0][] = room.beds.map(bed => {
            const assignedPatientsDetails: PatientType[] = allPatients.filter(
              p => p.currentBedId === bed.id && p.stayStartDate && p.stayEndDate && p.status
            );
            return {
              id: bed.id,
              label: bed.label,
              patients: assignedPatientsDetails,
            };
          });
          return {
            id: room.id,
            label: room.label,
            capabilities: room.capabilities,
            beds: bedsWithPatients,
          };
        });
        return {
          id: dept.id,
          name: dept.name,
          roomsData: roomsGantt,
        };
      });
      return {
        id: org.id,
        name: org.name,
        departments: departmentsData,
      };
    });
  }, []);

  const toggleOrganisationExpansion = (orgId: string, forceOpen?: boolean) => {
    setExpandedOrganisations(prev => ({
      ...prev,
      [orgId]: forceOpen === undefined ? !prev[orgId] : forceOpen,
    }));
  };

  return (
    <div className={styles.administrativeViewContainer}>
      <h2>Administrative Overview - {vossMunicipality.name}</h2>
      
      {/* New Top Metrics Section */}
      <div className={styles.topMetricsSection}>
        {/* Left Container: Municipality-Wide Stats */}
        <div className={styles.municipalityMetricsContainer}>
          <h3>Municipality Capacity</h3>
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Total Beds</span>
              <span className={styles.metricValue}>{municipalityOverallStats.totalBeds}</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Occupied Beds</span>
              <span className={styles.metricValue}>{municipalityOverallStats.assignedPatients}</span>
            </div>
            <div className={`${styles.metricCard} ${styles.metricCardOccupancy}`}>
              <span className={styles.metricLabel}>Occupancy Rate</span>
              <span className={styles.metricValue}>{municipalityOverallStats.occupancyRate}</span>
              <div className={styles.progressBarContainer}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${municipalityOverallStats.occupancyNumeric}%` }}
                  title={municipalityOverallStats.occupancyRate + (municipalityOverallStats.occupancyNumeric < parseFloat(municipalityOverallStats.occupancyRate) ? ' (Visual capped at 100%)' : '')}
                ></div>
              </div>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Vacancy Rate</span>
              <span className={styles.metricValue}>{municipalityOverallStats.vacancyRate}</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Total Organisations</span>
              <span className={styles.metricValue}>{municipalityOverallStats.totalOrganisations}</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Total Departments</span>
              <span className={styles.metricValue}>{municipalityOverallStats.totalDepartments}</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Total Rooms</span>
              <span className={styles.metricValue}>{municipalityOverallStats.totalRooms}</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Waiting List</span>
              <span className={styles.metricValue}>{municipalityOverallStats.patientsOnWaitingList}</span>
            </div>
          </div>
        </div>

        {/* Right Container: Per-Organisation Stats */}
        <div className={styles.organisationsMetricsContainer}>
          <h3>Organisations Overview</h3>
          {organisationDetailedStats.map(orgStat => (
            <div key={orgStat.id} className={styles.organisationStatCard}>
              <h4>
                <a
                  href={`#org-gantt-${orgStat.id}`}
                  onClick={(e) => {
                    // e.preventDefault(); // Optional: if we want JS to solely handle it
                    toggleOrganisationExpansion(orgStat.id, true);
                    document.getElementById(`org-gantt-${orgStat.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                  }}
                  className={styles.orgTitleLink}
                >
                  {orgStat.name}
                </a>
              </h4>
              <div className={styles.metricItem}><strong>Total Beds:</strong> {orgStat.totalBeds}</div>
              <div className={styles.metricItem}><strong>Occupied:</strong> {orgStat.occupiedBeds}</div>
              <div className={styles.metricItem}><strong>Occupancy:</strong> {orgStat.occupancyRate}</div>
              <div className={styles.metricItem}><strong>Vacancy:</strong> {orgStat.vacancyRate}</div>
              <div className={styles.metricItem}><strong>Departments:</strong> {orgStat.totalDepartments}</div>
              <div className={styles.metricItem}><strong>Rooms:</strong> {orgStat.totalRooms}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Existing Stats Grid - to be removed or repurposed. For now, I'll comment it out. */}
      {/*
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h4>Organisations</h4>
          <p>{municipalityOverallStats.totalOrganisations}</p>
        </div>
        // ... other stat cards ...
        <div className={styles.statCard}>
          <h4>Patients on Waiting List</h4>
          <p>{municipalityOverallStats.patientsOnWaitingList}</p>
        </div>
      </div>
      */}

      {/* Waiting List and Suggested Vacancies Section */}
      <div className={styles.waitingListSection}>
        <div className={styles.waitingListColumn}>
          <h2>Waiting List</h2>
          {processedWaitingList.length > 0 ? (
            <table className={styles.waitingListTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Waiting Days</th>
                  <th>Priority</th>
                  <th>Needs</th>
                  <th>Location</th> {/* New Column */}
                </tr>
              </thead>
              <tbody>
                {processedWaitingList.map((item: WaitingListItem & { waitingDays: number }) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.waitingDays}</td>
                    <td>{item.priority}</td>
                    <td>{item.needs.join(', ')}</td>
                    <td>N/A</td> {/* Placeholder for Location Data */}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No patients currently on the waiting list.</p>
          )}
        </div>

        <div className={styles.vacanciesColumn}>
          <h2>Suggested Vacant Spots</h2>
          {suggestedVacancies.length > 0 ? (
            <table className={styles.vacanciesTable}>
              <thead>
                <tr>
                  <th>Organisation</th>
                  <th>Department</th>
                  <th>Room</th>
                  <th>Bed</th>
                  <th>Availability</th>
                </tr>
              </thead>
              <tbody>
                {suggestedVacancies.map((vacancy: SuggestedVacancy) => (
                  <tr key={vacancy.id} className={vacancy.color === 'green' ? styles.availableNow : styles.availableSoon}>
                    <td>{vacancy.organisationName}</td>
                    <td>{vacancy.departmentName}</td>
                    <td>{vacancy.roomLabel}</td>
                    <td>{vacancy.bedLabel}</td>
                    <td>{vacancy.availabilityStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No immediate or upcoming vacancies found.</p>
          )}
        </div>
      </div>

      {/* Municipality-Wide Occupancy Gantt Chart Section (remains the same) */}
      <div style={{ marginTop: '40px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
        <h3>Municipality-Wide Occupancy Gantt</h3>
        <div style={{ marginBottom: '20px' }}>
          <TimeRangeToggle value={timeRange} onChange={setTimeRange} />
        </div>
        {municipalityGanttData.map(orgData => (
          <div key={orgData.id} id={`org-gantt-${orgData.id}`} className={styles.organisationSection}>
            <h4 onClick={() => toggleOrganisationExpansion(orgData.id)} className={styles.collapsibleHeader}>
              {orgData.name} {expandedOrganisations[orgData.id] ? '▼' : '►'}
            </h4>
            {expandedOrganisations[orgData.id] && (
              <div className={styles.departmentContainer}>
                {orgData.departments.map(deptData => (
                  <div key={deptData.id} className={styles.departmentSection}>
                    <h5>{deptData.name}</h5>
                    {deptData.roomsData.length > 0 ? (
                      <GanttChart 
                        roomsData={deptData.roomsData} 
                        timeRange={timeRange} 
                        startDate={startDate} 
                      />
                    ) : (
                      <p>No room data available for this department.</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdministrativeView;
