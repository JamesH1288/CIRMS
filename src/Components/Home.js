import { Link } from 'react-router-dom';
import '../App.css';  
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

function Home() {
  const [incidents, setIncidents] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [openIncidentCount, setOpenIncidentCount] = useState(0);
  const [inProgressIncidentCount, setInProgressIncidentCount] = useState(0);
  const [topIncidentTypes, setTopIncidentTypes] = useState([]);

  const COLORS = ['#0088FE', '#FFBB28']; // Colors for the pie chart

  const homeStyle = {
    backgroundColor: 'black', 
    height: '100vh',
    margin: 0,
    padding: 0,
  };

  // Helper function to format date to month-year
  const getMonthYear = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  // Fetching data from the backend
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/incidents`)
      .then((response) => {
        const data = response.data;

        setIncidents(data);

        // Calculate counts for Open and In Progress incidents
        const openCount = data.filter((incident) => incident.STATUS_ID === 1).length;
        const inProgressCount = data.filter((incident) => incident.STATUS_ID === 2).length;

        const typeCounts = data.reduce((acc, incident) => {
          acc[incident.INCIDENT_TYPE] = (acc[incident.INCIDENT_TYPE] || 0) + 1;
          return acc;
        }, {});

        const sortedTypes = Object.entries(typeCounts)
          .map(([type, count]) => ({ type, count }))
          .sort((a, b) => b.count - a.count);

        // top 3 incident types
        setTopIncidentTypes(sortedTypes.slice(0, 3));

        setOpenIncidentCount(openCount);
        setInProgressIncidentCount(inProgressCount);

        // incidents by month and year
        const aggregatedData = data.reduce((acc, incident) => {
          if (incident.INCIDENT_DATE) {
            const monthYear = getMonthYear(incident.INCIDENT_DATE);
            if (!acc[monthYear]) acc[monthYear] = { month: monthYear, incidents: [] };
            acc[monthYear].incidents.push(incident);
          }
          return acc;
        }, {});

        // data for the line chart 
        const formattedLineChartData = Object.values(aggregatedData)
          .map((entry) => ({
            month: entry.month,
            incidents: entry.incidents.length, 
          }))
          .sort((a, b) => new Date(a.month) - new Date(b.month)); 

        setLineChartData(formattedLineChartData);
      })
      .catch((error) => {
        console.error('Error fetching incidents:', error.response || error.message);
      });
  }, []);

  const pieChartData = [
    { name: 'Open', value: openIncidentCount },
    { name: 'In Progress', value: inProgressIncidentCount },
  ];

  return (
    <div style={homeStyle}> 
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
                <p>{openIncidentCount}</p>
              </div>

              <div className='Home-InProgress-Incidents-Stylng'>
                <h3>In Progress Incidents</h3>
                <p>{inProgressIncidentCount}</p>
              </div>

              <div className='Home-InProgress-Incidents-Stylng'>
                <section>
                <Link to="/IncidentManager">
                  <h3>Manage Incidents</h3>
                </Link>
              </section>
                <p></p>
              </div>
            </div>

            <div className="Incident-Dashboard-Home">
              <h1 className='Dashboard-Headers'>Incidents Over Time</h1>
              {lineChartData.length > 0 ? (
                <LineChart
                  width={800}
                  height={400}
                  data={lineChartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="incidents" stroke="#8884d8" />
                </LineChart>
              ) : (
                <p>No Data Available for this Chart</p>
              )}

              {/* Pie Chart */}
              <div style={{ marginTop: '20px' }}>
                <h1 className='Dashboard-Headers'>Incidents by Status</h1>
                <PieChart width={400} height={400}>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={(entry) => entry.name}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>

              {/* Top three incident Types */}
              <div className="Top-Incident-Types"style={{ marginTop: '20px' }}>
                <h1 className='Dashboard-Headers'>Top 3 Incident Types</h1>
                <ul>
                  {topIncidentTypes.map((incident, index) => (
                    <li key={index} style={{ fontSize: '18px', color: 'white', margin: '10px 0' }}>
                      {`${incident.type}: ${incident.count} incidents`}
                    </li>
                  ))}
                </ul>
              </div>
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
