import React, { useMemo } from 'react';
import styles from './MunicipalityView.module.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

// Import mock data
import {
  mockMunicipalityKPIs,
  mockHistoricalWaitingTimeSeries,
  mockHistoricalOccupancySeries,
  mockOrganizations,
} from '../../data/mockMunicipalityStats';
import { rooms as allRoomsData, Room, Bed } from '../../data/bedData'; // Import rooms and types
import waitingListRaw from '../../data/waitingList.json';

// Define an interface for the waiting list items
interface WaitingListItem {
  id: string;
  name: string;
  age: number;
  priority: 'High' | 'Medium' | 'Low';
  appliedDate: string;
  needs: string[];
}

// Type assertion for the imported JSON data
const waitingList: WaitingListItem[] = waitingListRaw as WaitingListItem[];

// Define an interface for match suggestions
interface MatchSuggestion {
  patient: WaitingListItem;
  room: Room;
  bed: Bed; // Suggesting a specific bed in the room
  score: number; // For ranking suggestions
  matchingNeeds: string[];
}

// Helper function to generate smart suggestions
const generateSuggestions = (patients: WaitingListItem[], rooms: Room[]): MatchSuggestion[] => {
  const suggestions: MatchSuggestion[] = [];
  const sortedPatients = [...patients].sort((a, b) => {
    const priorityOrder = { High: 0, Medium: 1, Low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  for (const patient of sortedPatients) {
    if (suggestions.length >= 5) break; // Limit to top 5 suggestions for now

    for (const room of rooms) {
      for (const bed of room.beds) {
        let score = 0;
        const matchingNeeds: string[] = [];

        // Basic matching: patient needs vs room capabilities
        patient.needs.forEach(need => {
          if (room.capabilities.includes(need)) {
            score += 2; // Higher score for direct capability match
            matchingNeeds.push(need);
          } else {
            // Bonus for related capabilities (very simplified)
            if (
              (need === 'Ceiling Hoist' && room.capabilities.some(cap => cap === 'Hoist')) || 
              (need === 'ADL Support' && room.capabilities.some(cap => cap === 'Short-term Room'))
            ){
              score +=1;
            }
          }
        });

        // Priority bonus
        if (patient.priority === 'High') score += 3;
        else if (patient.priority === 'Medium') score += 1;

        // Add suggestion if there's any match
        // Avoid suggesting the same patient to multiple beds in the same room if not necessary
        if (score > 0 && !suggestions.some(s => s.patient.id === patient.id && s.room.id === room.id)) {
          suggestions.push({
            patient,
            room,
            bed,
            score,
            matchingNeeds
          });
        }
      }
    }
  }

  return suggestions.sort((a, b) => b.score - a.score).slice(0, 5);
};

const MunicipalityView: React.FC = () => {
  const municipalityName = "Sandnes Municipality"; 

  // Memoize suggestions to avoid re-calculating on every render
  const smartSuggestions = useMemo(() => generateSuggestions(waitingList, allRoomsData), []);

  // Prepare data for Bed Status chart
  const historicalBedStatusData = useMemo(() => {
    const totalBeds = mockMunicipalityKPIs.totalBeds;
    return mockHistoricalOccupancySeries.map(item => {
      const occupied = Math.round((item.value / 100) * totalBeds);
      const vacant = totalBeds - occupied;
      return {
        date: item.date,
        occupied: occupied,
        vacant: vacant,
      };
    });
  }, []);

  return (
    <div className={styles.pageContainer}>
      {/* Top Level: Municipality Overview */}
      <section className={styles.topLevelSection}>
        <h1 className={styles.mainTitle}>{municipalityName} - Overview</h1> 
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
          <div className={styles.chartWrapper}>
            <h3 className={styles.chartTitle}>Waiting Time Trend (days)</h3> 
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={mockHistoricalWaitingTimeSeries}
                margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 12, padding: '5px' }} />
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Wait Time" /> 
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.chartWrapper}>
            <h3 className={styles.chartTitle}>Occupancy Rate Trend (%)</h3> 
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={mockHistoricalOccupancySeries}
                margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 12, padding: '5px' }} />
                <Line type="monotone" dataKey="value" stroke="#82ca9d" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Occupancy" /> 
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* New Stacked Bar Chart for Bed Status */}
          <div className={styles.chartWrapper}>
            <h3 className={styles.chartTitle}>Bed Status Over Time</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart 
                data={historicalBedStatusData}
                margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 12, padding: '5px' }} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: '10px' }} />
                <Bar dataKey="occupied" stackId="a" fill="#8884d8" name="Occupied" />
                <Bar dataKey="vacant" stackId="a" fill="#82ca9d" name="Vacant" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Mid Level: Organization Breakdown */}
      <section className={styles.midLevelSection}>
        <h2 className={styles.sectionTitle}>Nursing Homes</h2> 
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
          <h2 className={styles.sectionTitle}>Waiting List ({waitingList.length} people)</h2> 
          {waitingList.length > 0 ? (
            <ul className={styles.waitingListItems}>
              {waitingList.map(person => (
                <li key={person.id} className={styles.waitingListItem}>
                  <div className={styles.personInfo}>
                    <span className={styles.personName}>{person.name}</span> (Age: {person.age}) 
                    <div className={styles.personNeeds}>Needs: {person.needs.join(', ')}</div> 
                  </div>
                  <div className={styles.personDetails}>
                    Priority: <span className={`${styles.priorityTag} ${styles[`priority${person.priority}`]}`}>{person.priority}</span> <br />Applied: {new Date(person.appliedDate).toLocaleDateString()} 
                  </div>
                  <button className={styles.actionButtonSmall}>Process</button> 
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.waitingListPlaceholder}>No one on the waiting list.</div> 
          )}
        </div>
        <div className={styles.smartMatcherContainer}>
          <h2 className={styles.sectionTitle}>Decision support ({smartSuggestions.length})</h2> 
          {smartSuggestions.length > 0 ? (
            <ul className={styles.suggestionList}>
              {smartSuggestions.map((suggestion, index) => (
                <li key={`${suggestion.patient.id}-${suggestion.bed.id}-${index}`} className={styles.suggestionItem}>
                  <div className={styles.suggestionPatient}>
                    <span className={styles.personName}>{suggestion.patient.name}</span> (Prio: {suggestion.patient.priority})
                    <div className={styles.suggestionNeeds}>Needs: {suggestion.patient.needs.join(', ')}</div> 
                  </div>
                  <div className={styles.suggestionArrow}>➔</div>
                  <div className={styles.suggestionRoom}>
                    <span className={styles.roomName}>{suggestion.room.label} - {suggestion.bed.label}</span>
                    <div className={styles.suggestionCapabilities}>Room has: {suggestion.room.capabilities.join(', ')}</div> 
                    {suggestion.matchingNeeds.length > 0 && 
                      <div className={styles.matchingTags}>Matches: {suggestion.matchingNeeds.map(n => <span key={n} className={styles.matchTag}>{n}</span>)}</div> 
                    }
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.matcherPlaceholder}>No suggestions at the moment.</div> 
          )}
        </div>
      </section>
    </div>
  );
};

export default MunicipalityView;
