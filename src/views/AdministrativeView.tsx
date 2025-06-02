import React, { useMemo, useState } from 'react';
import { vossMunicipality } from '../data/municipalityData';
import { allPatients } from '../data/patients';
import { waitingList } from '../data/waitingList';
import styles from './AdministrativeView.module.css';
import { Organisation, Department, Room as RoomType, Bed as BedType, Patient as PatientType } from '../data/dataTypes';
import GanttChart from '../components/GanttChart';
import TimeRangeToggle from '../components/TimeRangeToggle';

interface MunicipalityStats {
  totalOrganisations: number;
  totalDepartments: number;
  totalRooms: number;
  totalBeds: number;
  assignedPatients: number;
  occupancyRate: string; // Percentage string
  patientsOnWaitingList: number;
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
  const [startDate, setStartDate] = useState<Date>(new Date('2025-05-01')); // Fixed demo date
  const [expandedOrganisations, setExpandedOrganisations] = useState<Record<string, boolean>>({});

  const stats: MunicipalityStats = useMemo(() => {
    let deptCount = 0;
    let roomCount = 0;
    let bedCount = 0;

    vossMunicipality.organisations.forEach(org => {
      deptCount += org.departments.length;
      org.departments.forEach(dept => {
        roomCount += dept.rooms.length;
        dept.rooms.forEach(room => {
          bedCount += room.beds.length;
        });
      });
    });

    const assignedPatientCount = allPatients.filter(p => p.currentBedId && p.status === 'active').length;
    const occupancy = bedCount > 0 ? ((assignedPatientCount / bedCount) * 100).toFixed(1) + '%' : 'N/A';

    return {
      totalOrganisations: vossMunicipality.organisations.length,
      totalDepartments: deptCount,
      totalRooms: roomCount,
      totalBeds: bedCount,
      assignedPatients: assignedPatientCount,
      occupancyRate: occupancy,
      patientsOnWaitingList: waitingList.length,
    };
  }, []);

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

  const toggleOrganisationExpansion = (orgId: string) => {
    setExpandedOrganisations(prev => ({ ...prev, [orgId]: !prev[orgId] }));
  };

  return (
    <div className={styles.administrativeViewContainer}>
      <h2>Administrative Overview - {vossMunicipality.name}</h2>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h4>Organisations</h4>
          <p>{stats.totalOrganisations}</p>
        </div>
        <div className={styles.statCard}>
          <h4>Departments</h4>
          <p>{stats.totalDepartments}</p>
        </div>
        <div className={styles.statCard}>
          <h4>Rooms</h4>
          <p>{stats.totalRooms}</p>
        </div>
        <div className={styles.statCard}>
          <h4>Total Beds</h4>
          <p>{stats.totalBeds}</p>
        </div>
        <div className={styles.statCard}>
          <h4>Assigned Patients (Active)</h4>
          <p>{stats.assignedPatients}</p>
        </div>
        <div className={styles.statCard}>
          <h4>Occupancy Rate</h4>
          <p>{stats.occupancyRate}</p>
        </div>
        <div className={styles.statCard}>
          <h4>Patients on Waiting List</h4>
          <p>{stats.patientsOnWaitingList}</p>
        </div>
      </div>

      <div style={{ marginTop: '40px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
        <h3>Municipality-Wide Occupancy</h3>
        <div style={{ marginBottom: '20px' }}>
          <TimeRangeToggle value={timeRange} onChange={setTimeRange} />
          {/* Consider adding a date picker for startDate here too */}
        </div>

        {municipalityGanttData.map(orgData => (
          <div key={orgData.id} className={styles.organisationSection}>
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
