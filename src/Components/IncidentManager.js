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
    color: 'white',
  };

  const [incidents, setIncidents] = useState([]); //list of all incindents
  const [isEditing, setIsEditing] = useState(false); 
  const [currentIncident, setCurrentIncident] = useState(null); 

  // status id int values converted to a readable text format
  const statusMapping = {
    1: 'Open',
    2: 'In Progress',
    3: 'Resolved',
  };

  // Fetching incidents
  useEffect(() => {
    const token = localStorage.getItem('token'); 

    axios.get(`${process.env.REACT_APP_API_URL}/api/incidents`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setIncidents(response.data); 
      })
      .catch(error => {
        console.error('Error fetching incidents:', error);
      });
  }, []);

  // Edit button click
  const handleEditClick = (incidentId) => {
    const incidentToEdit = incidents.find((incident) => incident.INCIDENT_ID === incidentId);
    setCurrentIncident(incidentToEdit); 
    setIsEditing(true); 
  };

  //  form submission
  const handleEditSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); //for the JWT token, but not used in testing atm

    axios.put(`${process.env.REACT_APP_API_URL}/api/incidents/${currentIncident.INCIDENT_ID}`, {
      ...currentIncident,
      STATUS_ID: parseInt(currentIncident.STATUS_ID, 10), 
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
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

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentIncident(null);
  };

  return (
    <div style={homeStyle}> 
      <div className="Home-Header">
        <h1>Cybersecurity Incident Reporting Management System</h1>
      </div>

      {/* Main content */}
      <div className="main">
        {/* sidebar nav */}
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

        {/* Main content below */}
        <div className="content">
          <main className="Incident-Manager-Header">
            <section>
              <h2>Incident Manager</h2>
            </section>
          </main>

          {/* Incident list */}
          <div className="IncidentListings">
            {incidents.length > 0 ? (
              <table className="incident-table">
                <thead className='IncidentTable-headers'>
                  <tr>
                    <th className='table-fonts'>ID</th>
                    <th className='table-fonts'>Type</th>
                    <th className='table-fonts'>Description</th>
                    <th className='table-fonts'>Status</th>
                    <th className='table-fonts'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map((incident) => (
                    <tr key={incident.INCIDENT_ID}>
                      <td>{incident.INCIDENT_ID}</td>
                      <td>{incident.INCIDENT_TYPE}</td>
                      <td>{incident.INCIDENT_DESCRIPTION}</td>
                      <td>{statusMapping[incident.STATUS_ID]}</td>
                      <td>
                        <button onClick={() => handleEditClick(incident.INCIDENT_ID)}>Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No incidents available.</p>
            )}
          </div>

          {/* Edit form below */}
          {isEditing && currentIncident && (
            <form onSubmit={handleEditSubmit} className="edit-form">
              <h3>Edit Incident</h3>
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
                value={currentIncident.STATUS_ID}
                onChange={(e) => setCurrentIncident({ ...currentIncident, STATUS_ID: e.target.value })}
              >
                <option value="1">Open</option>
                <option value="2">In Progress</option>
                <option value="3">Resolved</option>
              </select>

              <div className="edit-buttons">
                <button type="submit">Save Changes</button>
                <button type="button" onClick={handleCancelEdit}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="page-footer">
        <p>CIRMS System</p>
      </footer>
    </div>
  );
}

export default IncidentManager;
