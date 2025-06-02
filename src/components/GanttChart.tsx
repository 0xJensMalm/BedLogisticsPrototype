import React from 'react';
import styles from './GanttChart.module.css';
import { Room as RoomType, Bed as BedType, Patient as PatientType } from '../data/dataTypes'; // Import new types

// Define the structure GanttChart expects for its rooms prop
// This matches the GanttRoom interface from DepartmentView.tsx
interface GanttRoom extends Omit<RoomType, 'beds'> {
  beds: Array<Omit<BedType, 'assignedPatientId'> & { patients: PatientType[] }>;
}

type TimeRange = 'week' | 'month';

interface GanttChartProps {
  timeRange: TimeRange;
  startDate: Date;
  roomsData: GanttRoom[]; 
  onPatientSelect?: (patient: PatientType) => void; // Optional callback for patient selection
}

function getDaysArray(start: Date, end: Date) {
  const arr = [];
  let dt = new Date(start);
  while (dt <= end) {
    arr.push(new Date(dt));
    dt.setDate(dt.getDate() + 1);
  }
  return arr;
}

const statusStyles: Record<string, { bg: string; border?: string; opacity?: number }> = {
  active: {
    bg: '#e3d8f6', // softer pastel purple
  },
  planned: {
    bg: 'transparent',
    border: '2px dashed #bdaee2', // dashed outline
  },
  paused: {
    bg: '#f2f2f2', // light grey
    opacity: 0.5,
  },
  reserved: {
    bg: 'repeating-linear-gradient(135deg, #e9e6f5 0px, #e9e6f5 8px, #d0cbe9 8px, #d0cbe9 16px)',
    border: '1.5px solid #bdb6d6',
    opacity: 1,
  },
  // Removed 'awaiting_placement' and 'discharged' as they are not in Patient.status type
};

const GanttChart: React.FC<GanttChartProps> = ({ timeRange, startDate, roomsData, onPatientSelect }) => {
  // DEBUG LOGS
  console.log('--- GanttChart DEBUG ---');
  console.log('roomsData prop:', roomsData);
  console.log('timeRange:', timeRange, 'startDate:', startDate);

  const days = React.useMemo(() => {
    let arr: Date[] = [];
    if (timeRange === 'week') {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      arr = getDaysArray(start, end);
    } else { // timeRange === 'month'
      const currentMonthStart = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      const currentMonthEnd = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0); // Last day of current month
      const daysCurrentMonth = getDaysArray(currentMonthStart, currentMonthEnd);

      const nextMonthStart = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1); // First day of next month
      const nextMonthEnd = new Date(startDate.getFullYear(), startDate.getMonth() + 2, 0); // Last day of next month
      const daysNextMonth = getDaysArray(nextMonthStart, nextMonthEnd);

      arr = daysCurrentMonth.concat(daysNextMonth);
    }
    return arr;
  }, [timeRange, startDate]);

  if (!roomsData || roomsData.length === 0) {
    return <p>No department data available to display.</p>;
  }

  return (
    <div className={styles.ganttWrapper}>
      <div className={styles.ganttContent}>
        <div className={styles.headerRow}>
        <div className={styles.bedHeader}>Rom / Seng</div>
        <div className={styles.daysHeader} style={{ gridTemplateColumns: `repeat(${days.length}, minmax(50px, 1fr))` }}>
          {days.map((date) => (
            <div key={date.toISOString()} className={styles.dayCell}>
              {date.getDate()}
            </div>
          ))}
        </div>
      </div>
      {roomsData.map((room) => (
        <div key={room.id} className={styles.roomFrame}>
          <div className={styles.roomTitle}>{room.label}</div>
          {room.capabilities && room.capabilities.length > 0 && (
            <div className={styles.roomCapabilitiesContainer}> {/* New container for room-level tags */}
              {room.capabilities.map((capability, capIndex) => {
                const isLargeTag = capability.length > 10; // Example threshold for "large"
                return (
                  <span 
                    key={capIndex} 
                    className={`${styles.capabilityTag} ${isLargeTag ? styles.capabilityTagLarge : styles.capabilityTagSmall}`}
                  >
                    {capability}
                  </span>
                );
              })}
            </div>
          )}

          {room.beds.map((bed) => (
            <div key={bed.id} className={styles.row}>
              <div className={styles.bedInfoCell}>
                <div className={styles.bedNameLabel}>{bed.label}</div>
              </div>
              <div
                className={styles.timeline}
                style={{ ['--days-count' as any]: days.length, gridTemplateColumns: `repeat(${days.length}, minmax(50px, 1fr))` }}
              >
                {bed.patients.map((patient) => {
                  if (!patient.stayStartDate || !patient.stayEndDate || !patient.status) return null; // Ensure necessary fields exist

                  const patientStart = new Date(patient.stayStartDate);
                  const patientEnd = new Date(patient.stayEndDate);
                  const rangeStart = days[0];
                  const rangeEnd = days[days.length - 1];

                  if (patientEnd < rangeStart || patientStart > rangeEnd) return null;

                  // Ensure patientStart is not before rangeStart for calculation
                  const effectivePatientStart = patientStart < rangeStart ? rangeStart : patientStart;
                  // Ensure patientEnd is not after rangeEnd for calculation
                  const effectivePatientEnd = patientEnd > rangeEnd ? rangeEnd : patientEnd;
                  
                  let barStart = days.findIndex(d => 
                      d.getFullYear() === effectivePatientStart.getFullYear() &&
                      d.getMonth() === effectivePatientStart.getMonth() &&
                      d.getDate() === effectivePatientStart.getDate()
                  );

                  // Calculate end index: find first day *after* patientEnd
                  let barLast = days.findIndex(d => d > effectivePatientEnd);
                  let barEnd = barLast === -1 ? days.length : barLast;

                  // If patient starts before the viewable range but ends within it
                  if (barStart === -1 && patientStart < rangeStart && patientEnd >= rangeStart) {
                      barStart = 0;
                  }
                  
                  if (barStart === -1 || barStart >= barEnd) return null;

                  const currentStatusStyle = statusStyles[patient.status] || { bg: '#cccccc', opacity: 0.7 }; // Fallback style

                  const styleVars: React.CSSProperties = {
                    gridColumn: `${barStart + 1} / ${barEnd + 1}`,
                    '--patient-bg': currentStatusStyle.bg,
                    '--patient-border': currentStatusStyle.border ?? 'none',
                    '--patient-opacity': currentStatusStyle.opacity ?? 1,
                  } as any;

                  return (
                    <div
                      key={patient.id}
                      className={
                        patient.status === 'reserved'
                          ? `${styles.patientBar} ${styles.reservedBar}`
                          : styles.patientBar
                      }
                      style={styleVars}
                      onClick={() => onPatientSelect && onPatientSelect(patient)}
                      title={
                        `${patient.name}\nStatus: ${patient.status}\nFra: ${patient.stayStartDate} Til: ${patient.stayEndDate}` +
                        (patient.needs && patient.needs.length > 0 ? `\nBehov: ${patient.needs.join(', ')}` : '')
                      }
                    >
                      <span className={styles.patientName}>
                        {patient.name}
                      </span>
                      {patient.needs && patient.needs.length > 0 && (
                        <span className={styles.patientNeedTag}>
                          {patient.needs.join(', ')} {/* Assuming needs is an array */}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ))}
      </div> {/* Closing ganttContent */}
    </div>
  );
};

export default GanttChart;
