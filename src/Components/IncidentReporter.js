import React, { useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import '../App.css';

function IncidentReporter() {
    const [incident, setIncident] = useState({
        type: '',
        description: '',
        date: '',
        affectedSystems: '',
        severity: '',
        impact: '',
        actionsTaken: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
    });

    const history = useHistory();

    //  form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setIncident({ ...incident, [name]: value });
    };

    //  form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post(`${process.env.REACT_APP_API_URL}/incidents/add`, incident)
            .then((response) => {
                console.log(response.data);
                history.push(`/IncidentDetails/${response.data.id}`);
            })
            .catch((error) => {
                console.error('Error reporting the incident:', error);
            });
    };

    return (
        <div style={{ backgroundColor: 'black', height: '100vh', margin: 0, padding: 0 }}>
            <div className="Home-Header">
                <h1>Cybersecurity Incident Reporting Management System</h1>
            </div>

            <div className="main">
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

                <div className="content">
                    <div className="Incident-Reporter-Header">
                        <section>
                            <h2>Report an Incident</h2>
                        </section>
                    </div>

                    <div className="Reporting-Incident-Container">
                        <form className="Reporting-Incident-User-Form" onSubmit={handleSubmit}>
                            <hr className="white-thin-line"></hr>

                            <label className="Reporting-Incident-User-Form-LabelStyle">Type:</label>
                            <select name="type" value={incident.type} onChange={handleChange}>
                                <option>Phishing</option>
                                <option>Social Engineering</option>
                                <option>Malware</option>
                                <option>Data Breach</option>
                                <option>Denial of Service</option>
                                <option>Unauthorized Access</option>
                                <option>Other</option>
                            </select>

                            <textarea name="description" placeholder="Description" value={incident.description} onChange={handleChange} className="Reporting-Incident-User-Form-Texboxcolor"></textarea>

                            <br></br>
                            <hr className="white-thin-line"></hr>
                            <br></br>

                            <label className="Reporting-Incident-User-Form-LabelStyle">Date:</label>
                            <input type="date" name="date" value={incident.date} onChange={handleChange} />

                            <br></br>
                            <hr className="white-thin-line"></hr>
                            <br></br>

                            <label className="Reporting-Incident-User-Form-LabelStyle">Affected Systems:</label>
                            <textarea name="affectedSystems" placeholder="What are the affected users, systems or databases?" value={incident.affectedSystems} onChange={handleChange} className="Reporting-Incident-User-Form-Texboxcolor"></textarea>

                            <label className="Reporting-Incident-User-Form-LabelStyle">Severity:</label>
                            <select name="severity" value={incident.severity} onChange={handleChange}>
                                <option>Critical</option>
                                <option>High</option>
                                <option>Medium</option>
                                <option>Low</option>
                            </select>

                            <label className="Reporting-Incident-User-Form-LabelStyle">Impact:</label>
                            <textarea name="impact" placeholder="What is the immediate impact of this incident on personnel, systems or other operations?" value={incident.impact} onChange={handleChange} className="Reporting-Incident-User-Form-Texboxcolor"></textarea>

                            <label className="Reporting-Incident-User-Form-LabelStyle">Immediate Actions Taken:</label>
                            <textarea name="actionsTaken" placeholder="What actions, if any, were taken immediately to mitigate this incident?" value={incident.actionsTaken} onChange={handleChange} className="Reporting-Incident-User-Form-Texboxcolor"></textarea>

                            <br></br>
                            <hr className="white-thin-line"></hr>
                            <br></br>

                            <label className="Reporting-Incident-User-Form-LabelStyle">Contact Name:</label>
                            <input name="contactName" value={incident.contactName} onChange={handleChange} className="Reporting-Incident-User-Form-Texboxcolor" />

                            <label className="Reporting-Incident-User-Form-LabelStyle">Contact Email:</label>
                            <input name="contactEmail" value={incident.contactEmail} onChange={handleChange} className="Reporting-Incident-User-Form-Texboxcolor" />

                            <label className="Reporting-Incident-User-Form-LabelStyle">Contact Phone:</label>
                            <input name="contactPhone" value={incident.contactPhone} onChange={handleChange} className="Reporting-Incident-User-Form-Texboxcolor" />

                            <input className="Reporting-Incident-Submit-Button" type="submit" value="Report Incident" />
                        </form>
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
