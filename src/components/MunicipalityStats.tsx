import React, { useState } from 'react';
import municipalityStats from '../data/municipalityStats.json';
import waitingList from '../data/waitingList.json';
import '../globalColors.css';

export default function MunicipalityStats() {
  const [selected, setSelected] = useState<string | null>(null);

  // Calculate totals
  const totalCapacity = municipalityStats.reduce((sum, nh) => sum + nh.capacity, 0);
  const totalOccupied = municipalityStats.reduce((sum, nh) => sum + nh.occupied, 0);
  const totalAvailable = totalCapacity - totalOccupied;
  const occupancyRate = Math.round((totalOccupied / totalCapacity) * 100);

  const selectedNh = selected !== null ? municipalityStats.find(nh => nh.id === selected) : null;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', background: 'var(--color-bg-main)', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: 32 }}>
      {/* Analytics summary */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32, gap: 24 }}>
        <div style={{ flex: 1, background: 'var(--color-bg-card)', borderRadius: 12, padding: 20, textAlign: 'center', boxShadow: '0 1px 4px #0001' }}>
          <div style={{ fontSize: 18, color: 'var(--color-text-muted)' }}>Total Capacity</div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{totalCapacity}</div>
        </div>
        <div style={{ flex: 1, background: 'var(--color-bg-card)', borderRadius: 12, padding: 20, textAlign: 'center', boxShadow: '0 1px 4px #0001' }}>
          <div style={{ fontSize: 18, color: 'var(--color-text-muted)' }}>Occupied</div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{totalOccupied}</div>
        </div>
        <div style={{ flex: 1, background: 'var(--color-bg-card)', borderRadius: 12, padding: 20, textAlign: 'center', boxShadow: '0 1px 4px #0001' }}>
          <div style={{ fontSize: 18, color: 'var(--color-text-muted)' }}>Available</div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{totalAvailable}</div>
        </div>
        <div style={{ flex: 1, background: 'var(--color-bg-card)', borderRadius: 12, padding: 20, textAlign: 'center', boxShadow: '0 1px 4px #0001' }}>
          <div style={{ fontSize: 18, color: 'var(--color-text-muted)' }}>Occupancy Rate</div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{occupancyRate}%</div>
        </div>
      </div>

      {/* Nursing homes section */}
      <h2 style={{ margin: '32px 0 16px 0' }}>Nursing Homes</h2>
      <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
        {municipalityStats.map((nh) => (
          <button
            key={nh.id}
            onClick={() => setSelected(nh.id)}
            style={{
              flex: 1,
              background: selected === nh.id ? 'var(--color-accent)' : 'var(--color-bg-card)',
              border: selected === nh.id ? '2px solid var(--color-progress)' : '2px solid transparent',
              borderRadius: 12,
              padding: 20,
              minWidth: 160,
              boxShadow: '0 1px 4px #0001',
              cursor: 'pointer',
              transition: 'all 0.2s',
              outline: 'none',
            }}
          >
            <h3 style={{ margin: 0, fontWeight: 600, color: 'var(--color-text-main)' }}>{nh.name}</h3>
            <div style={{ fontSize: 28, fontWeight: 700, margin: '8px 0', color: 'var(--color-progress)' }}>{nh.occupied} / {nh.capacity}</div>
            <div style={{ color: 'var(--color-text-muted)' }}>Occupied / Capacity</div>
            <div style={{ height: 8, background: 'var(--color-muted)', borderRadius: 4, marginTop: 12 }}>
              <div style={{ width: `${(nh.occupied / nh.capacity) * 100}%`, height: 8, background: 'var(--color-progress)', borderRadius: 4, transition: 'width 0.3s' }} />
            </div>
          </button>
        ))}
      </div>
      {/* Detail panel for selected nursing home */}
      {selectedNh && (
        <div style={{
          margin: '0 0 32px 0',
          padding: 24,
          background: 'var(--color-bg-card)',
          borderRadius: 14,
          boxShadow: '0 2px 12px #0002',
          transition: 'all 0.3s',
          transform: 'scale(1)',
          opacity: 1,
        }}>
          <h3 style={{ margin: '0 0 12px 0', color: 'var(--color-progress)' }}>{selectedNh.name} Details</h3>
          <div style={{ fontSize: 18, marginBottom: 8 }}>Capacity: <b>{selectedNh.capacity}</b></div>
          <div style={{ fontSize: 18, marginBottom: 8 }}>Occupied: <b>{selectedNh.occupied}</b></div>
          <div style={{ fontSize: 18, marginBottom: 8 }}>Available: <b>{selectedNh.capacity - selectedNh.occupied}</b></div>
          <div style={{ fontSize: 18, marginBottom: 8 }}>Occupancy Rate: <b>{Math.round((selectedNh.occupied / selectedNh.capacity) * 100)}%</b></div>
          <button onClick={() => setSelected(null)} style={{ marginTop: 16, background: 'var(--color-accent)', border: 'none', borderRadius: 8, padding: '8px 18px', cursor: 'pointer', color: 'var(--color-text-main)', fontWeight: 600 }}>Close</button>
        </div>
      )}

      {/* Waiting list section */}
      <h2 style={{ marginTop: 40, marginBottom: 12 }}>Waiting List</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--color-table-row)', borderRadius: 8, overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: 'var(--color-table-header)', color: '#333' }}>
            <th style={{ padding: '8px 12px', textAlign: 'left' }}>Name</th>
            <th style={{ padding: '8px 12px', textAlign: 'left' }}>Age</th>
            <th style={{ padding: '8px 12px', textAlign: 'left' }}>Priority</th>
            <th style={{ padding: '8px 12px', textAlign: 'left' }}>Applied</th>
          </tr>
        </thead>
        <tbody>
          {waitingList.map(person => (
            <tr key={person.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px 12px' }}>{person.name}</td>
              <td style={{ padding: '8px 12px' }}>{person.age}</td>
              <td style={{ padding: '8px 12px' }}>{person.priority}</td>
              <td style={{ padding: '8px 12px' }}>{person.appliedDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
