import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function IncidentReporter() {
    const [incident, setIncident] = useState({
        type: '',
        description: '',
        date: '',
        affectedSystems: '',
        severity: 'Low', 
        impact: '',
        actionsTaken: '',
        otherDescription: '',
    });

    const [message, setMessage] = useState(''); // success or error messages
    const history = useHistory();

    // input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setIncident({ ...incident, [name]: value });
    };

    // form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const incidentPayload = {
            userId: 1, 
            statusId: 1, 
            incidentType: incident.type,
            description: incident.description,
            date: incident.date,
            affectedSystems: incident.affectedSystems || null,
            severity: incident.severity,
            impact: incident.impact || null,
            actionsTaken: incident.actionsTaken || null,
            otherDescription: incident.otherDescription || null,
        };

        if (!incident.type || !incident.description || !incident.date) {
            setMessage('Please fill in all required fields: Type, Description, and Date.');
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/incidents`,
                incidentPayload
            );
            setMessage('Incident reported successfully!');
            console.log(response.data);

            // Redirects to the incident details, but waits around 2 seconds
            setTimeout(() => {
                history.push(`/IncidentDetails/${response.data.id}`);
            }, 2000);
        } catch (error) {
            setMessage('Error reporting the incident. Please try again.');
            console.error('Error:', error.response || error.message);
        }
    };

    return (
        <div style={{ backgroundColor: 'black', height: '100vh', margin: 0, padding: 0 }}>
            <div className="Home-Header">
                <h1>Cybersecurity Incident Reporting Management System</h1>
            </div>

            <div className="main">
                <div className="sidebar-nav">
                    {/* Sidebar nav */}
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
                    <div className="Incident-Reporter-Header">
                        <section>
                            <h2>Report an Incident</h2>
                        </section>
                    </div>

                    <div className="Reporting-Incident-Container">
                        <form className="Reporting-Incident-User-Form" onSubmit={handleSubmit}>
                            <label>Type:</label>
                            <select name="type" value={incident.type} onChange={handleChange} required>
                                <option value="">Select Type</option>
                                <option value="Phishing">Phishing</option>
                                <option value="Social Engineering">Social Engineering</option>
                                <option value="Malware">Malware</option>
                                <option value="Data Breach">Data Breach</option>
                                <option value="Denial of Service">Denial of Service</option>
                                <option value="Unauthorized Access">Unauthorized Access</option>
                                <option value="Other">Other</option>
                            </select>

                            <label>Description:</label>
                            <textarea
                                name="description"
                                placeholder="Description"
                                value={incident.description}
                                onChange={handleChange}
                                required
                            ></textarea>

                            <label>Date:</label>
                            <input
                                type="date"
                                name="date"
                                value={incident.date}
                                onChange={handleChange}
                                required
                            />

                            <label>Affected Systems:</label>
                            <textarea
                                name="affectedSystems"
                                placeholder="Affected Systems (optional)"
                                value={incident.affectedSystems}
                                onChange={handleChange}
                            ></textarea>

                            <label>Severity:</label>
                            <select name="severity" value={incident.severity} onChange={handleChange}>
                                <option value="Critical">Critical</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>

                            <label>Impact:</label>
                            <textarea
                                name="impact"
                                placeholder="Impact (optional)"
                                value={incident.impact}
                                onChange={handleChange}
                            ></textarea>

                            <label>Actions Taken:</label>
                            <textarea
                                name="actionsTaken"
                                placeholder="Actions Taken (optional)"
                                value={incident.actionsTaken}
                                onChange={handleChange}
                            ></textarea>

                            <label>Other Description:</label>
                            <textarea
                                name="otherDescription"
                                placeholder="Other Description (optional)"
                                value={incident.otherDescription}
                                onChange={handleChange}
                            ></textarea>

                            <input type="submit" value="Report Incident" />
                        </form>

                        {/* Displays success or errors */}
                        {message && <p style={{ color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}
                    </div>
                </div>
            </div>

            <footer className="page-footer">
                <p>CIRMS System</p>
            </footer>
        </div>
    );
}

export default IncidentReporter;
