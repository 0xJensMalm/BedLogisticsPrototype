import React, { useState, useEffect } from 'react';
import { vossMunicipality } from '../data/municipalityData'; // To get initial departments
import { Organisation, Department, Room, Bed } from '../data/dataTypes';
import styles from './SetupView.module.css'; // Ensure this file is renamed and content updated

const SetupView: React.FC = () => {
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [selectedOrganisationId, setSelectedOrganisationId] = useState<string | null>(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  // State for the rooms of the currently selected department
  const [currentDepartmentRooms, setCurrentDepartmentRooms] = useState<Room[]>([]);

  const [newRoomLabel, setNewRoomLabel] = useState('');
  const [newRoomCapabilities, setNewRoomCapabilities] = useState(''); // Comma-separated
  const [bedsInNewRoom, setBedsInNewRoom] = useState<number>(1);

  // Load initial data from municipalityData and local storage if available
  useEffect(() => {
    const storedOrganisations = localStorage.getItem('aidnEhrSetupData');
    if (storedOrganisations) {
      setOrganisations(JSON.parse(storedOrganisations));
    } else {
      // Initialize with data from municipalityData.ts
      // Make a deep copy to prevent direct mutation of imported data
      const initialOrganisations = JSON.parse(JSON.stringify(vossMunicipality.organisations));
      setOrganisations(initialOrganisations);
      localStorage.setItem('aidnEhrSetupData', JSON.stringify(initialOrganisations));
    }
  }, []);

  // Update currentDepartmentRooms when selectedDepartmentId or organisations change
  useEffect(() => {
    if (selectedOrganisationId && selectedDepartmentId) {
      const org = organisations.find(o => o.id === selectedOrganisationId);
      const dept = org?.departments.find(d => d.id === selectedDepartmentId);
      setCurrentDepartmentRooms(dept ? dept.rooms : []);
    } else {
      setCurrentDepartmentRooms([]);
    }
  }, [selectedOrganisationId, selectedDepartmentId, organisations]);

  const handleSaveToLocalStorage = (updatedOrganisations: Organisation[]) => {
    localStorage.setItem('aidnEhrSetupData', JSON.stringify(updatedOrganisations));
    setOrganisations(updatedOrganisations);
  };

  const handleAddRoom = () => {
    if (!selectedOrganisationId || !selectedDepartmentId || !newRoomLabel.trim()) {
      alert('Please select an organisation, a department, and enter a room label.');
      return;
    }

    const newRoom: Room = {
      id: `room-${selectedDepartmentId}-${Date.now()}`, // Simple unique ID
      label: newRoomLabel,
      capabilities: newRoomCapabilities.split(',').map(c => c.trim()).filter(c => c),
      beds: Array.from({ length: bedsInNewRoom }, (_, i) => ({
        id: `bed-${selectedDepartmentId}-new-${Date.now()}-${i + 1}`, // Simple unique ID
        label: `Seng ${i + 1}`,
      })),
    };

    const updatedOrganisations = organisations.map(org => {
      if (org.id === selectedOrganisationId) {
        return {
          ...org,
          departments: org.departments.map(dept => {
            if (dept.id === selectedDepartmentId) {
              return { ...dept, rooms: [...dept.rooms, newRoom] };
            }
            return dept;
          }),
        };
      }
      return org;
    });

    handleSaveToLocalStorage(updatedOrganisations);
    setNewRoomLabel('');
    setNewRoomCapabilities('');
    setBedsInNewRoom(1);
  };

  const handleDeleteRoom = (roomId: string) => {
    if (!selectedOrganisationId || !selectedDepartmentId) return;

    const updatedOrganisations = organisations.map(org => {
      if (org.id === selectedOrganisationId) {
        return {
          ...org,
          departments: org.departments.map(dept => {
            if (dept.id === selectedDepartmentId) {
              return { ...dept, rooms: dept.rooms.filter(r => r.id !== roomId) };
            }
            return dept;
          }),
        };
      }
      return org;
    });
    handleSaveToLocalStorage(updatedOrganisations);
  };
  
  const selectedOrg = organisations.find(o => o.id === selectedOrganisationId);
  const selectedDeptObject = selectedOrg?.departments.find(d => d.id === selectedDepartmentId);

  return (
    <div className={styles.setupViewContainer}>
      <h2>Setup Organisations, Departments, and Rooms</h2>
      <p>Configuration is saved locally in your browser.</p>

      <div className={styles.selectionControls}>
        <label htmlFor="orgSelect">Organisation:</label>
        <select 
          id="orgSelect"
          value={selectedOrganisationId || ''} 
          onChange={(e) => {
            setSelectedOrganisationId(e.target.value);
            setSelectedDepartmentId(null); // Reset department when org changes
          }}
          className={styles.selectInput}
        >
          <option value="">-- Select Organisation --</option>
          {organisations.map(org => (
            <option key={org.id} value={org.id}>{org.name}</option>
          ))}
        </select>

        {selectedOrganisationId && selectedOrg && (
          <>
            <label htmlFor="deptSelect">Department:</label>
            <select 
              id="deptSelect"
              value={selectedDepartmentId || ''} 
              onChange={(e) => setSelectedDepartmentId(e.target.value)}
              className={styles.selectInput}
              disabled={!selectedOrganisationId}
            >
              <option value="">-- Select Department --</option>
              {selectedOrg.departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </>
        )}
      </div>

      {selectedDepartmentId && selectedDeptObject && (
        <div className={styles.roomManagementSection}>
          <h3>Manage Rooms for: {selectedDeptObject.name}</h3>
          <div className={styles.addRoomForm}>
            <h4>Add New Room</h4>
            <input
              type="text"
              placeholder="New Room Label (e.g., Rom 104)"
              value={newRoomLabel}
              onChange={(e) => setNewRoomLabel(e.target.value)}
              className={styles.textInput}
            />
            <input
              type="text"
              placeholder="Capabilities (comma-separated)"
              value={newRoomCapabilities}
              onChange={(e) => setNewRoomCapabilities(e.target.value)}
              className={styles.textInput}
            />
            <label htmlFor="bedsInNewRoomInput">Beds (1-4):</label>
            <input
              id="bedsInNewRoomInput"
              type="number"
              min="1"
              max="4" 
              value={bedsInNewRoom}
              onChange={(e) => setBedsInNewRoom(Math.max(1, Math.min(4, parseInt(e.target.value, 10))))}
              className={styles.numberInput}
            />
            <button onClick={handleAddRoom} className={styles.button}>Add Room</button>
          </div>

          <h4>Existing Rooms:</h4>
          {currentDepartmentRooms.length > 0 ? (
            <ul className={styles.roomList}>
              {currentDepartmentRooms.map(room => (
                <li key={room.id} className={styles.roomListItem}>
                  <span><strong>{room.label}</strong> (Beds: {room.beds.length}, Capabilities: {room.capabilities.join(', ') || 'None'})</span>
                  <button onClick={() => handleDeleteRoom(room.id)} className={styles.deleteButton}>Delete</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No rooms configured for this department yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SetupView;