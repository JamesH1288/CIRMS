import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from './Components/Home';
import IncidentReporter from './Components/IncidentReporter';
import IncidentDetails from './Components/IncidentDetails';
import IncidentManager from './Components/IncidentManager';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          {/* Redirect root path to /Home */}
          <Route exact path="/" render={() => <Redirect to="/Home" />} />
          <Route exact path="/Home" component={Home} />
          <Route path="/IncidentReporter" component={IncidentReporter} />
          <Route path="/IncidentDetails" component={IncidentDetails} />
          <Route path="/IncidentManager" component={IncidentManager} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
