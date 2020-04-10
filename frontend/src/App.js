import React from 'react';
import './App.css';
import LoginLayout from './layouts/login/Login';
import signupLayout from './layouts/signup/Signup';
import ProblemLayout from './layouts/problem/Problem';
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Link } from "react-router-dom";
import { ProtectedRoute } from "./_utils/protected.route";
import AppLayout from './layouts/app/AppLayout';

const hist = createBrowserHistory();

function App() {
  return (
    <div className="App">
      <Router history={hist}>
        <Switch>
          <Route exact path="/" component={ProblemLayout} />
          <Route exact path="/login" component={LoginLayout} />
          <Route exact path="/signup" component={signupLayout} />
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
