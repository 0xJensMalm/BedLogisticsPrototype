import React from 'react';
import styles from './Tabs.module.css';

// Make the component generic for the tab type
interface TabsProps<T extends string> {
  activeTab: T;
  onTabChange: (tab: T) => void;
  tabLabels: T[]; // Array of tab labels, which are also the keys
}

// Corrected generic component definition
function Tabs<T extends string>({ activeTab, onTabChange, tabLabels }: TabsProps<T>) {
  return (
    <div className={styles.tabs}>
      {tabLabels.map((tab) => (
        <button
          key={tab}
          className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
          onClick={() => onTabChange(tab)}
        >
          {tab} 
        </button>
      ))}
    </div>
  );
}

export default Tabs;
