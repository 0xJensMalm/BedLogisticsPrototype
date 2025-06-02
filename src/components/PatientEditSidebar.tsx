import React, { useState, useEffect } from 'react';
import { Patient as PatientType } from '../data/dataTypes';
import styles from './PatientEditSidebar.module.css';

interface PatientEditSidebarProps {
  patient: PatientType | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedPatient: PatientType) => void;
}

const PatientEditSidebar: React.FC<PatientEditSidebarProps> = ({ patient, isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'active' | 'planned' | 'paused' | 'reserved'>('planned');
  const [stayStartDate, setStayStartDate] = useState('');
  const [stayEndDate, setStayEndDate] = useState('');
  const [needs, setNeeds] = useState(''); // Comma-separated string for simplicity

  useEffect(() => {
    if (patient) {
      setName(patient.name);
      setStatus(patient.status || 'planned');
      setStayStartDate(patient.stayStartDate ? patient.stayStartDate.split('T')[0] : '');
      setStayEndDate(patient.stayEndDate ? patient.stayEndDate.split('T')[0] : '');
      setNeeds(patient.needs ? patient.needs.join(', ') : '');
    } else {
      // Reset form when no patient is selected or sidebar is closed
      setName('');
      setStatus('planned');
      setStayStartDate('');
      setStayEndDate('');
      setNeeds('');
    }
  }, [patient, isOpen]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!patient) return;

    const updatedPatient: PatientType = {
      ...patient,
      name, // Assuming name might be editable, or keep patient.name if not
      status,
      stayStartDate: stayStartDate || undefined,
      stayEndDate: stayEndDate || undefined,
      needs: needs.split(',').map(n => n.trim()).filter(n => n),
    };
    onSave(updatedPatient);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.sidebarHeader}>
        <h3>Edit Patient: {patient?.name}</h3>
        <button onClick={onClose} className={styles.closeButton}>&times;</button>
      </div>
      <form onSubmit={handleSubmit} className={styles.sidebarForm}>
        <div>
          <label htmlFor="patientName">Name:</label>
          <input type="text" id="patientName" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="patientStatus">Status:</label>
          <select id="patientStatus" value={status} onChange={(e) => setStatus(e.target.value as 'active' | 'planned' | 'paused' | 'reserved')}>
            <option value="active">Active</option>
            <option value="planned">Planned</option>
            <option value="paused">Paused</option>
            <option value="reserved">Reserved</option>
          </select>
        </div>
        <div>
          <label htmlFor="stayStartDate">Stay Start Date:</label>
          <input type="date" id="stayStartDate" value={stayStartDate} onChange={(e) => setStayStartDate(e.target.value)} />
        </div>
        <div>
          <label htmlFor="stayEndDate">Stay End Date:</label>
          <input type="date" id="stayEndDate" value={stayEndDate} onChange={(e) => setStayEndDate(e.target.value)} />
        </div>
        <div>
          <label htmlFor="patientNeeds">Needs/Labels (comma-separated):</label>
          <input type="text" id="patientNeeds" value={needs} onChange={(e) => setNeeds(e.target.value)} />
        </div>
        <div className={styles.formActions}>
          <button type="submit" className={styles.saveButton}>Save Changes</button>
          <button type="button" onClick={onClose} className={styles.cancelButton}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default PatientEditSidebar;
