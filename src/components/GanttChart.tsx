import React from 'react';
import { rooms, Room, Bed, Patient } from '../data/bedData';
import styles from './GanttChart.module.css';

type TimeRange = 'week' | 'month';

interface GanttChartProps {
  timeRange: TimeRange;
  startDate: Date;
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

// Softer pastel palette
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
};

const GanttChart: React.FC<GanttChartProps> = ({ timeRange, startDate }) => {
  // Calculate days for week/month view
  const days = React.useMemo(() => {
    let arr: Date[] = [];
    if (timeRange === 'week') {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      arr = getDaysArray(start, end);
    } else {
      const year = startDate.getFullYear();
      const month = startDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      arr = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
    }
    return arr;
  }, [timeRange, startDate]);

  return (
    <div className={styles.ganttWrapper}>
      <div className={styles.headerRow}>
        <div className={styles.bedHeader}>Rom / Seng</div>
        <div className={styles.daysHeader} style={{ gridTemplateColumns: `repeat(${days.length}, 1fr)` }}>
          {days.map((date) => (
            <div key={date.toISOString()} className={styles.dayCell}>
              {date.getDate()}
            </div>
          ))}
        </div>
      </div>
      {rooms.map((room) => (
        <div key={room.id} className={styles.roomFrame}>
          <div className={styles.roomLabel}>{room.label}</div>
          {room.beds.map((bed) => (
            <div key={bed.id} className={styles.row}>
              <div className={styles.bedLabel}>{bed.label}</div>
              <div
                className={styles.timeline}
                style={{ ['--days-count' as any]: days.length }}
              >
                {bed.patients.map((patient) => {
                  // Calculate overlap between patient stay and visible timeline
                  const patientStart = new Date(patient.inDate);
                  const patientEnd = new Date(patient.outDate);
                  const rangeStart = days[0];
                  const rangeEnd = days[days.length - 1];
                  // If no overlap, skip
                  if (patientEnd < rangeStart || patientStart > rangeEnd) return null;
                  // Clamp bar to visible range
                  const barStart = days.findIndex(d => d >= patientStart && d >= rangeStart);
                  // The last day the patient is present (inclusive)
                  const barLast = days.findIndex(d => d > patientEnd);
                  const barEnd = barLast === -1 ? days.length : barLast;
                  if (barStart === -1 || barStart >= barEnd) return null;
                  const styleVars: React.CSSProperties = {
                    gridColumn: `${barStart + 1} / ${barEnd + 1}`,
                    '--patient-bg': statusStyles[patient.status].bg,
                    '--patient-border': statusStyles[patient.status].border ?? 'none',
                    '--patient-opacity': statusStyles[patient.status].opacity ?? 1,
                  } as any;
                  return (
                    <div
                      key={patient.id}
                      className={styles.patientBar}
                      style={styleVars}
                      title={`${patient.name}\n${patient.status}\n${patient.inDate}–${patient.outDate}\n${patient.needs}`}
                    >
                      <span className={styles.patientName}>{patient.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GanttChart;
