import React, { useState } from 'react';
import Tabs from './components/Tabs';
import TimeRangeToggle from './components/TimeRangeToggle';
import GanttChart from './components/GanttChart';
import MunicipalityView from './views/MunicipalityView/MunicipalityView';
import './App.css';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Department' | 'Municipality' | 'Administration'>('Department');
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const [startDate, setStartDate] = useState<Date>(() => {
    // Set initial start date to match demo data for best Gantt chart visibility
    return new Date('2025-05-01');
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
        {activeTab === 'Municipality' && (
          <MunicipalityView />
        )}
        {activeTab === 'Administration' && (
          <div>
            <p>Administration tab content will be here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
