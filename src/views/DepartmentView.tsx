import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Department, Room as RoomType, Bed as BedType, Patient as PatientType } from '../data/dataTypes';
import { vossMunicipality } from '../data/municipalityData';
import { allPatients as initialPatients } from '../data/patients'; // Renamed to avoid conflict with state
import PatientEditSidebar from '../components/PatientEditSidebar';
import GanttChart from '../components/GanttChart'; 
import TimeRangeToggle from '../components/TimeRangeToggle'; 

interface DepartmentOption {
  id: string;
  name: string;
  organisationName: string;
}

interface GanttRoom extends Omit<RoomType, 'beds'> {
  beds: Array<Omit<BedType, 'assignedPatientId'> & { patients: PatientType[] }>;
}

const DepartmentView: React.FC = () => {
  const [patientsData, setPatientsData] = useState<PatientType[]>(initialPatients);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedPatientForEdit, setSelectedPatientForEdit] = useState<PatientType | null>(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | undefined>();
  const [activeDepartmentGanttData, setActiveDepartmentGanttData] = useState<GanttRoom[]>([]);
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const [startDate, setStartDate] = useState<Date>(() => {
    // Default to the current real-world date.
    // Note: If current year is not 2025, and patient data is only for 2025,
    // the chart might appear empty for the current date until navigated to May 2025.
    return new Date(); 
  });

  const departmentOptions = useMemo<DepartmentOption[]>(() => {
    const options: DepartmentOption[] = [];
    vossMunicipality.organisations.forEach(org => {
      org.departments.forEach(dept => {
        options.push({ id: dept.id, name: dept.name, organisationName: org.name });
      });
    });
    if (options.length > 0 && !selectedDepartmentId) {
      setSelectedDepartmentId(options[0].id);
    }
    return options;
  }, []); 

  useEffect(() => {
    if (!selectedDepartmentId) {
      setActiveDepartmentGanttData([]);
      return;
    }

    let foundDepartment: Department | undefined;
    for (const org of vossMunicipality.organisations) {
      foundDepartment = org.departments.find(dept => dept.id === selectedDepartmentId);
      if (foundDepartment) break;
    }

    if (foundDepartment) {
      const preparedGanttData: GanttRoom[] = foundDepartment.rooms.map(room => {
        const bedsWithPatients: GanttRoom['beds'][0][] = room.beds.map(bed => {
          const assignedPatients: PatientType[] = patientsData.filter( // Use patientsData from state
            p => p.currentBedId === bed.id && p.stayStartDate && p.stayEndDate && p.status
          );
          return {
            id: bed.id,
            label: bed.label,
            patients: assignedPatients,
          };
        });
        return {
          id: room.id,
          label: room.label,
          capabilities: room.capabilities,
          beds: bedsWithPatients,
        };
      });
      setActiveDepartmentGanttData(preparedGanttData);
    } else {
      setActiveDepartmentGanttData([]);
    }
  }, [selectedDepartmentId, patientsData]); // Add patientsData to dependency array

  const handleDepartmentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartmentId(event.target.value);
  };

  const handleOpenSidebar = useCallback((patient: PatientType) => {
    setSelectedPatientForEdit(patient);
    setIsSidebarOpen(true);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setIsSidebarOpen(false);
    setSelectedPatientForEdit(null);
  }, []);

  const handleSavePatient = useCallback((updatedPatient: PatientType) => {
    setPatientsData(prevPatients => 
      prevPatients.map(p => p.id === updatedPatient.id ? updatedPatient : p)
    );
    handleCloseSidebar();
  }, [handleCloseSidebar]);

  return (
    <div>
      <h2>Department View</h2>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div>
          <label htmlFor="department-select" style={{ marginRight: '10px', display: 'block', marginBottom: '5px' }}>Select Department:</label>
          <select id="department-select" value={selectedDepartmentId || ''} onChange={handleDepartmentChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
            {departmentOptions.map(option => (
              <option key={option.id} value={option.id}>
                {option.organisationName} - {option.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Select Time Range:</label>
          <TimeRangeToggle value={timeRange} onChange={setTimeRange} />
        </div>
      </div>

      {selectedDepartmentId && activeDepartmentGanttData.length > 0 ? (
        <div>
          <h3>Gantt Chart for {departmentOptions.find(d => d.id === selectedDepartmentId)?.name}</h3>
          <GanttChart 
            roomsData={activeDepartmentGanttData} 
            timeRange={timeRange} 
            startDate={startDate} 
            onPatientSelect={handleOpenSidebar} // Pass the handler to GanttChart
          />
        </div>
      ) : (
        <p>Please select a department or ensure the selected department has room data.</p>
      )}
      <PatientEditSidebar 
        patient={selectedPatientForEdit}
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        onSave={handleSavePatient}
      />
    </div>
  );
};

export default DepartmentView;
