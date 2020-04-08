import React from 'react';
import './App.css';
import LoginLayout from './layouts/login/Login';
import signupLayout from './layouts/signup/Signup';
import ProblemLayout from './layouts/problem/Problem';
import Problems from './layouts/user/Problems';
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect, Link } from "react-router-dom";
import { ProtectedRoute } from "./_utils/protected.route";
import Problem from './layouts/user/Problem';
import Create from './layouts/user/Create';
import Assigned from './layouts/user/assigned';
const hist = createBrowserHistory();

function App() {
  return (
    <div className="App">
      <Router history={hist}>
        <Switch>
          <Route exact path="/" component={ProblemLayout} />
          <Route exact path="/login" component={LoginLayout} />
          <Route exact path="/signup" component={signupLayout} />
          <ProtectedRoute exact path="/app/create" component={Create} />
          <ProtectedRoute exact path="/app/problems" component={Problems} />
          <ProtectedRoute exact path="/app/problems/:id" component={Problem} />
          <ProtectedRoute exact path="/app/assigned" component={Assigned} />
          <Redirect exact from="/app" to="/app/problems" />
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
