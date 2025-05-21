import React, { useState } from 'react';
import Tabs from './components/Tabs';
import TimeRangeToggle from './components/TimeRangeToggle';
import GanttChart from './components/GanttChart';
import './App.css';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Department' | 'Municipality' | 'Administration'>('Department');
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const [startDate, setStartDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0,0,0,0);
    return d;
  });

  return (
    <div className="App" style={{ background: 'linear-gradient(135deg, #f8f6fb 0%, #f2eaff 100%)', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === 'Department' && (
          <>
            <TimeRangeToggle value={timeRange} onChange={setTimeRange} />
            {/* Date picker can be added here if needed */}
            <GanttChart timeRange={timeRange} startDate={startDate} />
          </>
        )}
        {/* Municipality and Administration tabs can be implemented here */}
      </div>
    </div>
  );
};

export default App;
