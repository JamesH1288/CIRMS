import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from './Components/Home';
import IncidentReporter from './Components/IncidentReporter';
import IncidentDetails from './Components/IncidentDetails';
import IncidentManager from './Components/IncidentManager';
import Login from './Components/loginForm'; 

function App() {
  // checks if user is authenticated
  const isAuthenticated = () => !!localStorage.getItem('token');

  return (
    <Router>
      <div>
        <Switch>
          {/* Route for the Login page */}
          <Route exact path="/login" component={Login} />

          <Route
            exact
            path="/Home"
            render={() => (isAuthenticated() ? <Home /> : <Redirect to="/login" />)}
          />
          <Route
            path="/IncidentReporter"
            render={() => (isAuthenticated() ? <IncidentReporter/> : <Redirect to="/login" />)}
          />
          <Route
            exact
            path="/IncidentDetails"
            render={() => (isAuthenticated() ? <IncidentDetails /> : <Redirect to="/login" />)}
          />
          <Route
            path="/IncidentDetails/:id"
            render={(props) =>
              isAuthenticated() ? <IncidentDetails {...props}/> : <Redirect to="/login" />
            }
          />
          <Route
            path="/IncidentManager"
            render={() => (isAuthenticated() ? <IncidentManager /> : <Redirect to="/login" />)}
          />

          {/* redirect to Home if authenticated, if not, redirects to Login page*/}
          <Route
            exact
            path="/"
            render={() => <Redirect to={isAuthenticated() ? '/Home' : '/login'} />}
          />

          <Route render={() => <Redirect to={isAuthenticated() ? '/Home' : '/login'} />} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
