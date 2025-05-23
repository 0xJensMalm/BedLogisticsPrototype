import React, { useState } from 'react';
import './AdministrationView.css'; // We'll create this CSS file later

const AdministrationView: React.FC = () => {
  const [numberOfRooms, setNumberOfRooms] = useState<number>(0);
  const [roomLabels, setRoomLabels] = useState<string[]>([]);
  const [currentLabel, setCurrentLabel] = useState<string>('');

  const handleAddLabel = () => {
    if (currentLabel.trim() !== '') {
      setRoomLabels([...roomLabels, currentLabel.trim()]);
      setCurrentLabel('');
    }
  };

  return (
    <div className="administration-view">
      <h2>Administration Settings</h2>
      
      <div className="admin-section">
        <h3>Room Configuration</h3>
        <label htmlFor="numberOfRooms">Number of Rooms:</label>
        <input 
          type="number" 
          id="numberOfRooms" 
          value={numberOfRooms}
          onChange={(e) => setNumberOfRooms(parseInt(e.target.value, 10) || 0)}
          min="0"
        />
      </div>

      <div className="admin-section">
        <h3>Room Labels</h3>
        <input 
          type="text" 
          value={currentLabel}
          onChange={(e) => setCurrentLabel(e.target.value)}
          placeholder="Enter new label"
        />
        <button onClick={handleAddLabel}>Add Label</button>
        <div>
          <h4>Current Labels:</h4>
          {roomLabels.length > 0 ? (
            <ul>
              {roomLabels.map((label, index) => (
                <li key={index}>{label}</li>
              ))}
            </ul>
          ) : (
            <p>No labels added yet.</p>
          )}
        </div>
      </div>

      {/* We can add more settings here later */}
      <button onClick={() => alert(`Settings: ${numberOfRooms} rooms, Labels: ${roomLabels.join(', ')}`)}>
        Save Settings (Prototype)
      </button>
    </div>
  );
};

export default AdministrationView;
