import { Link } from 'react-router-dom';
import '../App.css';  
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function IncidentManager() {
  const homeStyle = {
    backgroundColor: 'black', 
    height: '100vh',
    margin: 0,
    padding: 0,
  };

  const [incidents, setIncidents] = useState([]); // List of all incidents
  const [isEditing, setIsEditing] = useState(false); // Track if editing
  const [currentIncident, setCurrentIncident] = useState(null); // Current incident being edited

  // Fetch incidents data from the backend
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/incidents`)
      .then(response => {
        setIncidents(response.data); // Load incidents data
      })
      .catch(error => {
        console.error('Error fetching incidents:', error);
      });
  }, []);

  // Handle Edit button click
  const handleEditClick = (incidentId) => {
    const incidentToEdit = incidents.find((incident) => incident.INCIDENT_ID === incidentId);
    setCurrentIncident(incidentToEdit); 
    setIsEditing(true); // Display the edit form
  };

  // Handle form submission
  const handleEditSubmit = (e) => {
    e.preventDefault();
    
    axios.put(`${process.env.REACT_APP_API_URL}/api/incidents/${currentIncident.INCIDENT_ID}`, currentIncident)
      .then((response) => {
        const updatedIncident = response.data;

        setIncidents((prevIncidents) =>
          prevIncidents.map((incident) =>
            incident.INCIDENT_ID === updatedIncident.INCIDENT_ID ? updatedIncident : incident
          )
        );

        setIsEditing(false); 
      })
      .catch((error) => {
        console.error('Error updating incident:', error);
      });
  };

  return (
    <div style={homeStyle}> 
      <div className="Home-Header">
        <h1>Cybersecurity Incident Reporting Management System</h1>
      </div>

      {/* Main content */}
      <div className="main">
        {/* Left-hand sidebar menu */}
        <div className="sidebar-nav">
          <div className="content-wrapper">
            <main className="Home">
              <section>
                <Link to="/Home"><h2>Home</h2></Link>
              </section>
            </main>
          </div>

          <div className="content-wrapper">
            <main className="Reporting-Bin">
              <section>
                <Link to="/IncidentReporter"><h2>Report An Incident</h2></Link>
              </section>
            </main>
          </div>

          <div className="content-wrapper">
            <main className="Incident-Detail-Bin">
              <section>
                <Link to="/IncidentDetails"><h2>Incident Details</h2></Link>
              </section>
            </main>
          </div>

          <div className="content-wrapper">
            <main className="Incident-Manager">
              <section>
                <Link to="/IncidentManager"><h2>Incident Manager</h2></Link>
              </section>
            </main>
          </div>
        </div>

        {/* Main content div container */}
        <div className="content">
          <main className="Incident-Manager-Header">
            <section>
              <h2>Incident Manager</h2>
            </section>
          </main>

          {/* incidents with edit buttons */}
          <div>
            {incidents.length > 0 ? (
              incidents.map(incident => (
                <div key={incident.INCIDENT_ID}>
                  <h3>{incident.INCIDENT_TYPE} - {incident.STATUS_NAME}</h3>
                  <button onClick={() => handleEditClick(incident.INCIDENT_ID)}>Edit</button>
                </div>
              ))
            ) : (
              <div className='No-Incidents-Available-styling'>
                <p>No incidents available.</p>
              </div>
            )}
          </div>

          {/* edit form shown when isEditing is true */}
          {isEditing && currentIncident && (
            <form onSubmit={handleEditSubmit}>
              <label>Type</label>
              <input
                type="text"
                value={currentIncident.INCIDENT_TYPE}
                onChange={(e) => setCurrentIncident({ ...currentIncident, INCIDENT_TYPE: e.target.value })}
              />
              
              <label>Description</label>
              <textarea
                value={currentIncident.INCIDENT_DESCRIPTION}
                onChange={(e) => setCurrentIncident({ ...currentIncident, INCIDENT_DESCRIPTION: e.target.value })}
              />
              
              <label>Status</label>
              <select
                value={currentIncident.STATUS_NAME}
                onChange={(e) => setCurrentIncident({ ...currentIncident, STATUS_NAME: e.target.value })}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>

              <button type="submit">Save Changes</button>
              <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
            </form>
          )}
        </div>
      </div>

      {/* Page footer */}
      <footer className="page-footer">
        <p>CIRMS System</p>
      </footer>
    </div>
  );
}

export default IncidentManager;
