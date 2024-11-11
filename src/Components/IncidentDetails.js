import { Link } from 'react-router-dom';
import '../App.css';  
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function IncidentDetails({ match }) {
  const [incident, setIncident] = useState(null); 
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const incidentId = match.params.id; 

  useEffect(() => {
    axios.get(`REACT_APP_API_URL/${incidentId}`)
      .then(response => {
        setIncident(response.data);
        setError(null); 
      })
      .catch(error => {
        console.error('Error fetching the incident details:', error);
        setError('Could not fetch incident details.');
      });
  }, [incidentId]);

  const homeStyle = {
    backgroundColor: 'black', 
    height: '100vh',
    margin: 0,
    padding: 0,
  };

  const incidentMatchesSearch = () => {
    if (!incident) return false; 
    const search = searchTerm.toLowerCase();
    return (
      incident.INCIDENT_TYPE?.toLowerCase().includes(search) ||
      incident.STATUS_NAME?.toLowerCase().includes(search) ||
      incident.INCIDENT_DESCRIPTION?.toLowerCase().includes(search)
    );
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!incident) {
    return <div>Loading...</div>;
  }

  return (
    <div style={homeStyle}> 
      <div className="Home-Header">
        <h1>Cybersecurity Incident Reporting Management System</h1>
      </div>

      <div className="main">
        <div className="sidebar-nav">
          <Link to="/Home"><h2>Home</h2></Link>
          <Link to="/IncidentReporter"><h2>Report An Incident</h2></Link>
          <Link to="/IncidentDetails"><h2>Incident Details</h2></Link>
          <Link to="/IncidentManager"><h2>Incident Manager</h2></Link>
        </div>

        <div className="content">
          <main className="Incident-Details-Header">
            <h2>Incident Details</h2>
          </main>

          <div className="Incident-details-search-container">
            <input 
              className="Incident-details-search-function"
              type="text"
              placeholder="Search incident details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '10px', fontSize: '16px', width: '100%' }}
            />
          </div>

          <hr className="white-thin-line"></hr>

          {incidentMatchesSearch() ? (
            <div className="Incident-details">
              <div className='Incident-details-crit-info-styling'>
                <h1 className='h1-Incident-details'>Incident ID: {incident.INCIDENT_ID}</h1>
                <h1 className='h1-Incident-details'>Incident Type: {incident.INCIDENT_TYPE}</h1>
                <h1 className='h1-Incident-details'>Status: {incident.STATUS_NAME || 'Open'}</h1>
              </div>

              <hr className="white-thin-line"></hr>

              <div className='Incident-details-more-info-styling'>
                <h2 className='h2-Incident-details'>Date Reported: {incident.INCIDENT_DATE ? new Date(incident.INCIDENT_DATE).toLocaleDateString() : 'N/A'}</h2>
                <h2 className='h2-Incident-details'>Severity: {incident.SEVERITY}</h2>
                <h2 className='h2-Incident-details'>Description: {incident.INCIDENT_DESCRIPTION}</h2>
                <h2 className='h2-Incident-details'>Affected Systems: {incident.AFFECTED_SYSTEMS}</h2>
                <h2 className='h2-Incident-details'>Impact: {incident.IMPACT}</h2>
                <h2 className='h2-Incident-details'>Immediate Actions Taken: {incident.ACTIONS_TAKEN}</h2>
                <h2 className='h2-Incident-details'>Reported By: {incident.ContactName}</h2>
              </div>
            </div>
          ) : (
            <div className="Incident-Details-Search-Error-Handling">
              <p>No incident details match your search.</p>
            </div>
          )}
        </div>
      </div>

      <footer className="page-footer">
        <p>CIRMS System</p>
      </footer>
    </div>
  );
}

export default IncidentDetails;
