import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import  {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

import Dashboard from 	'./components/Common/Dashboard/Dashboard';
import Map from 	'./components/Map/Map';
import Charts from 	'./components/Charts/Charts';
import Keywords from './components/Keywords/Keywords';

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <div style={{height: '100vh', display: 'flex', flexDirection: 'column'}}>
        <Router>
          <Dashboard />
          <Switch>
            <Route exact path="/" component={Map} />
            <Route path="/charts" component={Charts} /> 
            <Route path="/keywords" component={Keywords} /> 
          </Switch>
        </Router>
      </div>
    </React.Fragment>
  );
}

export default App;
