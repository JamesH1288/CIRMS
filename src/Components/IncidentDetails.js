import { Link, useParams, useHistory } from 'react-router-dom';
import '../App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function IncidentDetails() {
    const { id: initialIncidentId } = useParams(); 
    const [incidentId, setIncidentId] = useState(initialIncidentId || ''); 
    const [incident, setIncident] = useState(null);
    const [searchId, setSearchId] = useState(''); 
    const [error, setError] = useState(null);
    const history = useHistory();

    const fetchIncidentDetails = async (id) => {
        try {
            const token = localStorage.getItem('token'); 
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/incidents/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            });
            setIncident(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching the incident details:', err);
            setError('Could not fetch incident details.');
            setIncident(null);
        }
    };

    useEffect(() => {
        if (incidentId) {
            fetchIncidentDetails(incidentId);
        }
    }, [incidentId]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchId) {
            setIncidentId(searchId); 
            history.push(`/IncidentDetails/${searchId}`); 
        }
    };

    const homeStyle = {
        backgroundColor: 'black',
        height: '100vh',
        margin: 0,
        padding: 0,
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div style={homeStyle}>
            <div className="Home-Header">
                <h1>Cybersecurity Incident Reporting Management System</h1>
            </div>

            <div className="main">
                <div className="sidebar-nav">
                    <div className="content-wrapper">
                        <main className="Home">
                            <section>
                                <Link to="/Home">
                                    <h2>Home</h2>
                                </Link>
                            </section>
                        </main>
                    </div>

                    <div className="content-wrapper">
                        <main className="Reporting-Bin">
                            <section>
                                <Link to="/IncidentReporter">
                                    <h2>Report An Incident</h2>
                                </Link>
                            </section>
                        </main>
                    </div>

                    <div className="content-wrapper">
                        <main className="Incident-Detail-Bin">
                            <section>
                                <Link to="/IncidentDetails">
                                    <h2>Incident Details</h2>
                                </Link>
                            </section>
                        </main>
                    </div>

                    <div className="content-wrapper">
                        <main className="Incident-Manager">
                            <section>
                                <Link to="/IncidentManager">
                                    <h2>Incident Manager</h2>
                                </Link>
                            </section>
                        </main>
                    </div>
                </div>

                <div className="content">
                    <main className="Incident-Details-Header">
                        <h2>Incident Details</h2>
                    </main>

                    <div className="Incident-details-search-container">
                        <form onSubmit={handleSearch} style={{ display: 'flex', marginBottom: '10px' }}>
                            <input
                                className="Incident-details-search-function"
                                type="text"
                                placeholder="Search by Incident ID..."
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                style={{ padding: '10px', fontSize: '16px', width: '80%' }}
                            />
                            <button
                                type="submit"
                                style={{
                                    padding: '10px',
                                    fontSize: '16px',
                                    backgroundColor: 'gray',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    marginLeft: '10px',
                                    cursor: 'pointer',
                                }}
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    <hr className="white-thin-line"></hr>

                    {incident ? (
                        <div className="Incident-details">
                            <div className="Incident-details-crit-info-styling">
                                <h1 className="h1-Incident-details">Incident ID: {incident.INCIDENT_ID}</h1>
                                <h1 className="h1-Incident-details">Incident Type: {incident.INCIDENT_TYPE}</h1>
                                <h1 className="h1-Incident-details">Status: {incident.STATUS_NAME || 'Open'}</h1>
                            </div>

                            <hr className="white-thin-line"></hr>

                            <div className="Incident-details-more-info-styling">
                                <h2 className="h2-Incident-details">
                                    Date Reported: {incident.INCIDENT_DATE ? new Date(incident.INCIDENT_DATE).toLocaleDateString() : 'N/A'}
                                </h2>
                                <h2 className="h2-Incident-details">Severity: {incident.SEVERITY}</h2>
                                <h2 className="h2-Incident-details">Description: {incident.INCIDENT_DESCRIPTION}</h2>
                                <h2 className="h2-Incident-details">Affected Systems: {incident.AFFECTED_SYSTEMS}</h2>
                                <h2 className="h2-Incident-details">Impact: {incident.IMPACT}</h2>
                                <h2 className="h2-Incident-details">Immediate Actions Taken: {incident.ACTIONS_TAKEN}</h2>
                                <h2 className="h2-Incident-details">Reported By: {incident.ContactName}</h2>
                            </div>
                        </div>
                    ) : (
                        <div className="Incident-Details-Search-Error-Handling">
                            <p>Enter an Incident ID to view details.</p>
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