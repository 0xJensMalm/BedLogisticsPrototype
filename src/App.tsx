import React, { useState } from 'react';
import Tabs from './components/Tabs';
import './App.css';

import DepartmentView from './views/DepartmentView';
import AdministrativeView from './views/AdministrativeView';
import SetupView from './views/SetupView';

export type MainTab = 'Department' | 'Administrative' | 'Setup';

const App: React.FC = () => {
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('Department');

  return (
    <div className="App" style={{ background: 'linear-gradient(135deg, #f8f6fb 0%, #f2eaff 100%)', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '95%', margin: '0 auto' }}>
        <Tabs<MainTab>
          activeTab={activeMainTab}
          onTabChange={setActiveMainTab}
          tabLabels={['Department', 'Administrative', 'Setup']}
        />
        {/* Conditional rendering of the main views */}
        {activeMainTab === 'Department' && (
          <DepartmentView />
        )}
        {activeMainTab === 'Administrative' && (
          <AdministrativeView />
        )}
        {activeMainTab === 'Setup' && (
          <SetupView />
        )}
      </div>
    </div>
  );
};

export default App;
