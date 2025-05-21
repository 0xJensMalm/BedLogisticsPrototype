import React from 'react';
import styles from './Tabs.module.css';

type Tab = 'Department' | 'Municipality' | 'Administration';

interface TabsProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className={styles.tabs}>
      {(['Department', 'Municipality', 'Administration'] as Tab[]).map((tab) => (
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
};

export default Tabs;
