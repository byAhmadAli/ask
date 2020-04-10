import React, {Component} from 'react';
import auth from '../../_services/Auth';
import { Route, Link, Switch, Redirect } from "react-router-dom";
import Login from '../login/Login';
import Signup from '../signup/Signup';

class AuthLayout extends Component{
    constructor(props){
        super(props);
        
    }

    isAuthenticated () {
        return auth.isAuthenticated() ? <Redirect from="/login" to="/app" /> : null
    };

    render(){
        return(
            <div className="auth-layout">
                <div className="auth-content">
                    <h1 className="mb-3 font-weight-normal">
                        <Link to="/">فضفض</Link>
                    </h1>
                    <div>
                        <Switch>
                            <Route exact path="/auth/login" component={Login} />
                            <Route exact path="/auth/signup" component={Signup} />
                            <Redirect exact from="/auth" to="/auth/signup" />
                        </Switch>
                    </div>
                    <p className="mt-5 mb-3 text-muted">© 2020 فضفض</p>
                </div>
                {this.isAuthenticated()}
            </div>
            
        )
    }
}

export default AuthLayout;