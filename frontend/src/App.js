import React from 'react';
import './App.css';

import { createBrowserHistory } from "history";
import { Router, Route, Switch, Link } from "react-router-dom";
import { ProtectedRoute } from "./_utils/protected.route";
import AppLayout from './layouts/app/AppLayout';
import AuthLayout from './layouts/auth/AuthLayout';
import ProblemLayout from './layouts/problem/Problem';

const hist = createBrowserHistory();

function App() {
  return (
    <div className="App">
      <Router history={hist}>
        <Switch>
          <Route exact path="/" component={ProblemLayout} />
          <Route path="/auth" component={AuthLayout} />
          <ProtectedRoute path="/app" component={AppLayout} />
          <Route path="*" component={() => {
            return(
              <div className="text-center">
                <h1>404</h1>
                NOT FOUND<br />
                <Link to="/app">Back</Link>
              </div>
            )
          }} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
