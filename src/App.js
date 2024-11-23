import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from './Components/Home';
import IncidentReporter from './Components/IncidentReporter';
import IncidentDetails from './Components/IncidentDetails';
import IncidentManager from './Components/IncidentManager';
import Login from './Components/loginForm'; // Import the Login component

function App() {
  // Function to check if the user is authenticated (e.g., token in localStorage)
  const isAuthenticated = () => !!localStorage.getItem('token');

  return (
    <Router>
      <div>
        <Switch>
          {/* Route for the Login page */}
          <Route exact path="/login" component={Login} />

          {/* Protected Routes */}
          <Route
            exact
            path="/Home"
            render={() => (isAuthenticated() ? <Home /> : <Redirect to="/login" />)}
          />
          <Route
            path="/IncidentReporter"
            render={() => (isAuthenticated() ? <IncidentReporter /> : <Redirect to="/login" />)}
          />
          <Route
            path="/IncidentDetails"
            render={() => (isAuthenticated() ? <IncidentDetails /> : <Redirect to="/login" />)}
          />
          <Route
            path="/IncidentManager"
            render={() => (isAuthenticated() ? <IncidentManager /> : <Redirect to="/login" />)}
          />

          {/* Default Route: Redirect to Home if authenticated, otherwise to Login */}
          <Route
            exact
            path="/"
            render={() => <Redirect to={isAuthenticated() ? '/Home' : '/login'} />}
          />

          {/* Fallback Route: Redirect unknown paths */}
          <Route render={() => <Redirect to={isAuthenticated() ? '/Home' : '/login'} />} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
