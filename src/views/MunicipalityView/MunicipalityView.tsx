import React from 'react';
import styles from './MunicipalityView.module.css';

// Import mock data
import {
  mockMunicipalityKPIs,
  mockHistoricalWaitingTimeSeries,
  mockHistoricalOccupancySeries,
  mockOrganizations,
} from '../../data/mockMunicipalityStats';
// import { rooms } from '../../data/bedData'; // For room capabilities in matching - will use later
// import waitingList from '../../data/waitingList.json'; // Will import and process for waiting list section

const MunicipalityView: React.FC = () => {
  const municipalityName = "Sandnes Kommune"; // Example name

  return (
    <div className={styles.pageContainer}>
      {/* Top Level: Municipality Overview */}
      <section className={styles.topLevelSection}>
        <h1 className={styles.mainTitle}>{municipalityName} - Oversikt</h1>
        <div className={styles.kpiContainer}>
          <div className={styles.scorecard}>
            <span className={styles.scorecardLabel}>Total Beds:</span>
            <span className={styles.scorecardValue}>{mockMunicipalityKPIs.totalBeds}</span>
          </div>
          <div className={styles.scorecard}>
            <span className={styles.scorecardLabel}>Occupancy:</span>
            <span className={styles.scorecardValue}>{mockMunicipalityKPIs.occupancyRate}%</span>
          </div>
          <div className={styles.scorecard}>
            <span className={styles.scorecardLabel}>Waiting List:</span>
            <span className={styles.scorecardValue}>{mockMunicipalityKPIs.patientsOnWaitingList}</span>
          </div>
          <div className={styles.scorecard}>
            <span className={styles.scorecardLabel}>Avg. Wait Time:</span>
            <span className={styles.scorecardValue}>{mockMunicipalityKPIs.averageWaitingTime}</span>
          </div>
        </div>
        <div className={styles.chartsContainer}>
          <div className={styles.chartPlaceholder}>
            <svg width="100%" height="100%" viewBox="0 0 100 50" preserveAspectRatio="none">
              <polyline fill="none" stroke="#bdc3c7" strokeWidth="2" points="0,45 15,30 30,35 45,20 60,25 75,10 90,15 100,5" />
              <text x="50" y="30" fontFamily="Segoe UI" fontSize="5" fill="#7f8c8d" textAnchor="middle">Waiting Time Trend</text>
            </svg>
          </div>
          <div className={styles.chartPlaceholder}>
            <svg width="100%" height="100%" viewBox="0 0 100 50" preserveAspectRatio="none">
              <polyline fill="none" stroke="#bdc3c7" strokeWidth="2" points="0,10 15,15 30,5 45,20 60,15 75,25 90,20 100,30" />
              <text x="50" y="30" fontFamily="Segoe UI" fontSize="5" fill="#7f8c8d" textAnchor="middle">Occupancy Rate Trend</text>
            </svg>
          </div>
        </div>
      </section>

      {/* Mid Level: Organization Breakdown */}
      <section className={styles.midLevelSection}>
        <h2 className={styles.sectionTitle}>Sykehjem</h2>
        <div className={styles.organizationCardsContainer}>
          {mockOrganizations.map(org => (
            <div key={org.id} className={styles.organizationCard}>
              <h3>{org.name}</h3>
              <p>Total Beds: {org.totalBeds}</p>
              <p>Occupancy: {org.occupancyRate}%</p>
              <p>Waiting: {org.patientsOnWaitingList}</p>
              <button className={styles.actionButton}>View Department</button>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Level: Waiting List & Smart Matching */}
      <section className={styles.bottomLevelSection}>
        <div className={styles.waitingListContainer}>
          <h2 className={styles.sectionTitle}>Venteliste</h2>
          <div className={styles.waitingListPlaceholder}>Waiting List Items will go here... (Placeholder)</div>
        </div>
        <div className={styles.smartMatcherContainer}>
          <h2 className={styles.sectionTitle}>Smarte Forslag</h2>
          <div className={styles.matcherPlaceholder}>Matching suggestions will go here... (Placeholder)</div>
        </div>
      </section>
    </div>
  );
};

export default MunicipalityView;
