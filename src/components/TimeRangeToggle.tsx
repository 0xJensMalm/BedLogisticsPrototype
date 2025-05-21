import React from 'react';
import styles from './TimeRangeToggle.module.css';

type TimeRange = 'week' | 'month';

interface TimeRangeToggleProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

const TimeRangeToggle: React.FC<TimeRangeToggleProps> = ({ value, onChange }) => {
  return (
    <div className={styles.toggleGroup}>
      <button
        className={`${styles.toggle} ${value === 'week' ? styles.active : ''}`}
        onClick={() => onChange('week')}
      >
        Uke
      </button>
      <button
        className={`${styles.toggle} ${value === 'month' ? styles.active : ''}`}
        onClick={() => onChange('month')}
      >
        Måned
      </button>
    </div>
  );
};

export default TimeRangeToggle;
