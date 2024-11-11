import { Link } from 'react-router-dom';
import '../App.css';  
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function Home() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  const homeStyle = {
    backgroundColor: 'black', 
    height: '100vh',
    margin: 0,
    padding: 0,
  };

  // fetching data from the backend
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/incidents`)
      .then((response) => {
        setIncidents(response.data);
        setLoading(false);

        // Process incidents to create chart data
        const incidentDataByDate = response.data.reduce((acc, incident) => {
          const date = new Date(incident.date).toLocaleDateString();
          if (!acc[date]) {
            acc[date] = { date: date, count: 0 };
          }
          acc[date].count++;
          return acc;
        }, {});

        setChartData(Object.values(incidentDataByDate));
      })
      .catch((error) => {
        console.error('An error has occurred fetching incidents');
        setLoading(false);
      });
  }, []);

  // Filtering the incidents by status
  const openIncidents = incidents.filter(incident => incident.status === 'Open');
  const inProgressIncidents = incidents.filter(incident => incident.status === 'In Progress');

  if (loading) {
    return <div>Loading Data...</div>;
  }

  return (
    <div style={homeStyle}> 
      <div className="Home-Header">
        <h1>Cybersecurity Incident Reporting Management System</h1>
      </div>

      <div className="main">
        <div className="sidebar-nav">
          {/* Sidebar Navigation */}
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
          <div className="dashboard-content-wrapper">
            <main className="Home-Right-Header">
              <section>
                <h2>Home</h2>
              </section>
            </main>
          </div>

          <div className="Incident-Overview-Container">
            <div className='Incident-Status-Overview-Container'>
              <div className='Home-Open-Incidents-Stylng'>
                <h3>Open Incidents</h3>
                {/* Open Incidents Table */}
              </div>

              <div className='Home-InProgress-Incidents-Stylng'>
                <h3>In Progress Incidents</h3>
                {/* In Progress Incidents Table */}
              </div>
            </div>

            <div className="Incident-Dashboard-Home">
              <p>Dashboard</p>
              {chartData.length > 0 ? (
                
                //properties of the chart
                <LineChart
                  width={400} height={400} data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" />
                </LineChart>
              ) : (
                <p>No Data Available for this Chart</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="page-footer">
        <p>CIRMS System</p>
      </footer>
    </div>
  );
}

export default Home;
